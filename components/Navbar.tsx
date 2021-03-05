import Link from "next/link";
import { useContext } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../lib/context";
import { auth } from "../lib/firebase";

export default function Navbar() {
  const { user, username } = useContext(UserContext);

  return (
    <div>
      <nav className="navbar">
        <ul>
          <li className="nav-item-home">
            <Link href="/">
              <button className="btn-logo">HOME</button>
            </Link>
          </li>

          {/* user is signed-in and has username */}
          {username && (
            <>
              <li>
                <Link href="/admin">
                  <a className="btn-blue">Manage posts</a>
                </Link>
              </li>
              <li>
                <button
                  className="btn-blue"
                  onClick={() => {
                    toast.success("signed out");
                    auth.signOut();
                  }}
                >
                  Sign out
                </button>
              </li>
              <li className="nav-item-profile">
                <Link href={`/${username}`}>
                  <a>
                    <img src={user?.photoURL} />
                  </a>
                </Link>
              </li>
            </>
          )}

          {/* user is not signed OR has not created username */}
          {!username && (
            <Link href="/login">
              <a className="btn-blue">Log in</a>
            </Link>
          )}
        </ul>
      </nav>
    </div>
  );
}
