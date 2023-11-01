import Link from "next/link";
import GeneralLogo from "../Logos/GeneralLogo";
import LeagueLogo from "../Logos/LeagueLogo";

import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

function Navbar() {
  const isAuthorized = false;

  return (
    <>
      <nav className="flex flex-row gap-4 justify-between bg-slate-800 p-2 sticky top-0">
        <ul className="flex flex-row">
          <li>
            <Link href="/">
              <GeneralLogo
                name="NHL95-sprites-banner"
                width={200}
                height={200}
              />
            </Link>
          </li>
        </ul>
        <ul className="flex flex-row gap-4 items-center">
          <li>
            <Link href="/standings">
              <LeagueLogo name="w" width="50" height="50" />
            </Link>
          </li>
        </ul>
        <ul className="flex flex-row gap-4 items-center">
          <li>
            <Link href="/submit-game" className="text-orange-400">
              <button className=" rounded-md p-1 border-orange-400 border">
                Submit Game
              </button>
            </Link>
          </li>
          {isAuthorized && <Link href="dashboard">Dashboard</Link>}
          {isAuthorized ? (
            <li>
              <Link href="sign-in">
                <FaSignOutAlt className="text-blue-600" />
              </Link>
            </li>
          ) : (
            <li>
              <Link href="sign-in">
                <FaSignInAlt className="text-orange-400" />
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
}

export default Navbar;
