"use client";

import Link from "next/link";
import GeneralLogo from "../Logos/GeneralLogo";
import LeagueLogo from "../Logos/LeagueLogo";

import { useAuthorizationStatus } from "@/context/UserAuthContext";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

function Navbar() {
  const { isAuthorized } = useAuthorizationStatus();

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
        <ul className="flex flex-row gap-4 items-center text-orange-400">
          <li>
            <Link href="/submit-game">
              <button className=" rounded-md p-1 border-orange-400 border">
                Submit Game
              </button>
            </Link>
          </li>
          {isAuthorized && (
            <li>
              <Link href="dashboard">Dashboard</Link>
            </li>
          )}
          {isAuthorized ? (
            <li>
              <Link href="/sign-out">
                <FaSignOutAlt className="text-green-600" />
              </Link>
            </li>
          ) : (
            <li>
              <Link href="/login">
                <FaSignInAlt />
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
}

export default Navbar;
