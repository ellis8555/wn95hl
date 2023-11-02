"use client";

import Link from "next/link";
import GeneralLogo from "@/components/server/Logos/GeneralLogo";
import LeagueLogo from "@/components/server/Logos/LeagueLogo";

import { useAuthorizationStatus } from "@/context/UserAuthContext";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { AiOutlineCloudUpload } from "react-icons/ai";

function Navbar() {
  const { isAuthorized } = useAuthorizationStatus();

  return (
    <>
      <nav className="flex flex-row gap-4 justify-between bg-slate-800 p-2 sticky top-0 sm:relative">
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
        <ul className="flex flex-row gap-4 items-center sm:absolute sm:left-1/2">
          <li>
            <Link href="/standings">
              <LeagueLogo name="w" width="50" height="50" />
            </Link>
          </li>
        </ul>
        <ul className="flex flex-row gap-4 items-center text-orange-400">
          {isAuthorized && (
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
          )}
          <li>
            <Link href="/submit">
              <AiOutlineCloudUpload size="1.75rem" />
            </Link>
          </li>
          {isAuthorized ? (
            <li>
              <Link href="/logout">
                <FaSignOutAlt className="text-green-600" size="1.75rem" />
              </Link>
            </li>
          ) : (
            <li>
              <Link href="/login">
                <FaSignInAlt size="1.75rem" />
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
}

export default Navbar;
