import { useContext } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../lib/context";
import { auth, googleAuthProvider } from "../lib/firebase";

export default function Enter(props) {
  const { user, username } = useContext(UserContext);

  return (
    <main>
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
  const signInWithGoogle = async () => {
    try {
      await auth.signInWithPopup(googleAuthProvider);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src={"/google-icon.svg"} /> Sign in with Google
    </button>
  );
}

function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign out</button>;
}

function UsernameForm() {
  return <></>;
}
