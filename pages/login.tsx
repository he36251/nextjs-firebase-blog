import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../lib/context";
import { auth, emailAuthProvider, facebookAuthProvider, firestore, googleAuthProvider } from "../lib/firebase";
import debounce from "lodash.debounce";
import { useRouter } from "next/router";

export default function Login() {
  const { user, username } = useContext(UserContext);

  return (
    <main className="text-center">
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
}

//Signin with Google
function SignInButton() {
  var router = useRouter();
  
  const signInWithGoogle = async () => {
    try {
      await auth.signInWithPopup(googleAuthProvider);

      //Redirect to home
      router.push('/');

    } catch (error) {
      console.log(error);

      handleAccountsWithDifferentProviders(error);
    }
  };

  const signInWithFacebook = async () => {
    try {
      await auth.signInWithPopup(facebookAuthProvider);

      //Redirect to home
      router.push('/');

    } catch (error) {
      console.log(error);

      handleAccountsWithDifferentProviders(error);
    }
  };

  const handleAccountsWithDifferentProviders = async (error) => {
    if (error.code == 'auth/account-exists-with-different-credential') {

      // Lookup existing account’s provider ID.
      auth.fetchSignInMethodsForEmail(error.email).then((providers) => {
        if (providers.indexOf(emailAuthProvider.providerId) != -1) {
          alert('You already have an email account. Please sign in with your email and password.');
        }

        if (providers.indexOf(googleAuthProvider.providerId) != -1) {
          alert('You already have an account associated with your Google account. Please sign in with Google.');
        }

        if (providers.indexOf(facebookAuthProvider.providerId) != -1) {
          alert('You already have an account associated with your Facebook account. Please sign in with Facebook.');
        }
      });
    }
  };

  return (
    <>
    <button className="btn-login-icon" onClick={signInWithGoogle}>
      <img src={"/google-icon.svg"} /> Sign in with Google
    </button>

    <br/>

    <button className="btn-login-icon" onClick={signInWithFacebook}>
      <img src={"/facebook-icon.png"} /> Sign in with Facebook
    </button>
    </>
  );
}

function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign out</button>;
}

function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  const onChange = (e) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  // useCallback is required for debounce to work
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = firestore.doc(`usernames/${username}`);
        const { exists } = await ref.get();

        console.log("Firestore read executed!");

        setIsValid(!exists);
        setLoading(false);
      }
    }, 500),
    []
  );

  const onSubmit = async (e) => {
    e.preventDefault();

    //Create refs for both documents
    const userDoc = firestore.doc(`users/${user.uid}`);
    const usernameDoc = firestore.doc(`usernames/${formValue}`);

    //Commit both together (DB transaction) as a batch write
    const batch = firestore.batch();

    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    batch.set(usernameDoc, { uid: user.uid });

    try {
      await batch.commit();
    } catch (error) {
      console.log(error);
    }

    return null;
  };

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input
            name="username"
            placeholder="username"
            value={formValue}
            onChange={onChange}
          />

          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />

          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>

          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );

  function UsernameMessage({ username, isValid, loading }) {
    if (loading) {
      return <p>Checking...</p>;
    } else if (isValid) {
      return <p className="text-success">{username} is available!</p>;
    } else if (username && !isValid) {
      return <p className="text-danger">That username is taken!</p>;
    } else {
      return <p></p>;
    }
  }
}
