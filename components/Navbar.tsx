import Link from "next/link";
import { useContext } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../lib/context";
import { auth } from "../lib/firebase";

export default function Navbar() {
  const {user, username} = useContext(UserContext)

  return (
    <div>
      <nav className="navbar">
        <ul>
          <li>
            <Link href="/">
              <button className="btn-logo">HOME</button>
            </Link>
          </li>

          {/* user is signed-in and has username */}
          {username && (
            <>
              <li>
                <Link href="/admin">
                  <button className="btn-blue">Write Posts</button>
                </Link>
              </li>
              <li>
                
                <button className="btn-blue" onClick={() => {
                  toast.success('signed out');
                  auth.signOut();
                  }}>Sign out</button>
                
              </li>
              <li>
                <Link href={`/${username}`}>
                  <img src={user?.photoURL} />
                </Link>
              </li>
            </>
          )}

          {/* user is not signed OR has not created username */}
          {!username && (
            <Link href="/login">
              <button className="btn-blue">Log in</button>
            </Link>
          )}
        </ul>
      </nav>
    </div>
  );
}
