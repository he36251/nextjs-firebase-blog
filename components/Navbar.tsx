import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";

export default function Navbar() {
  const {user, username} = useContext(UserContext)

  return (
    <div>
      <nav className="navbar">
        <ul>
          <li>
            <Link href="/">
              <button className="btn-logo">FEED</button>
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
                <Link href={`/${username}`}>
                  <img src={user?.photoURL} />
                </Link>
              </li>
            </>
          )}

          {/* user is not signed OR has not created username */}
          {!username && (
            <Link href="/enter">
              <button className="btn-blue">Log in</button>
            </Link>
          )}
        </ul>
      </nav>
    </div>
  );
}
