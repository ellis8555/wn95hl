"use client";

import Link from "next/link";
import Image from "next/image";

import { useState } from "react";

import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

function Navbar() {
  const [isAuthorized, setIsAuthorized] = useState(false);

  return (
    <>
      <nav className="flex flex-row gap-4 justify-between bg-slate-800 mb-2 p-2 sticky top-0">
        <ul className="flex flex-row">
          <li>
            <Link href="/">
              <Image
                src="/images/home-page/NHL95onlineBANNER2-removebg-preview-removebg-preview.png"
                alt="NHL 95 online"
                width={200}
                height={200}
                style={{ height: "auto", width: "auto" }}
                priority
              />
            </Link>
          </li>
        </ul>
        <ul className="flex flex-row gap-4 items-center">
          <li>
            <Link href="standings">Standings</Link>
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
