import Link from "next/link";
import { FaSignInAlt } from "react-icons/fa";

function Navbar() {
  return (
    <>
      <nav className="flex flex-row gap-4 justify-between bg-slate-800 mb-2 p-2">
        <ul className="flex flex-row">
          <li>
            <Link href="/">Home</Link>
          </li>
        </ul>
        <ul className="flex flex-row gap-4 items-center">
          <li>
            <Link href="Standings">Standings</Link>
          </li>
          <li>
            <Link href="SignIn">
              <FaSignInAlt />
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;
