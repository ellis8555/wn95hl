"use client";

import "./styles.css";
import Link from "next/link";
import GeneralLogo from "@/components/server/Logos/GeneralLogo";
import { useState } from "react";
import { useAuthorizationStatus } from "@/context/UserAuthContext";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { FaHockeyPuck } from "react-icons/fa";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthorized } = useAuthorizationStatus();

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <div className="relative sticky top-0 w-full">
      <nav className="flex flex-row gap-4 justify-center items-center lg:justify-between bg-slate-800 p-2">
        {/* mobile toggle menu icon */}
        <FaHockeyPuck
          // if logged in menu icon green otherwise orange
          className={`${
            isAuthorized ? "text-green-400" : "text-orange-400"
          } absolute lg:hidden right-2 text-2xl hover:cursor-pointer`}
          onClick={toggleMenu}
        />
        <ul className="flex flex-row">
          <li>
            <Link href="/" onClick={closeMenu}>
              <GeneralLogo
                name="NHL95-sprites-banner"
                width={200}
                height={200}
              />
            </Link>
          </li>
        </ul>
        <ul className="hidden lg:flex flex-row gap-4 items-center text-orange-400">
          {/* Authorization related links */}
          {isAuthorized && (
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
          )}
          <li>
            <Link href="/submit">
              <AiOutlineCloudUpload size="1.5rem" />
            </Link>
          </li>
          {isAuthorized ? (
            <li>
              <Link href="/logout">
                <FaSignOutAlt className="text-green-600" size="1.5rem" />
              </Link>
            </li>
          ) : (
            <li>
              <Link href="/login">
                <FaSignInAlt size="1.5rem" />
              </Link>
            </li>
          )}
        </ul>
      </nav>
      {/*  mobile menu */}
      <div className="text-slate-900 bg-slate-500 lg:hidden">
        {/* toggle class depending on menu being opened or closed */}
        <ul
          className={`menuClosed ${
            isMenuOpen ? "openMenu" : ""
          } overflow-hidden`}
        >
          <Link href="/recent-scores">
            <li onClick={toggleMenu}>Scores</li>
          </Link>
          <Link href="/submit">
            <li onClick={toggleMenu}>Submit</li>
          </Link>
          {/* if logged in display dashboard and logout */}
          {isAuthorized ? (
            <div>
              <Link href="/dashboard">
                <li>Dashboard</li>
              </Link>
              <Link href="/logout">
                <li>Logout</li>
              </Link>
            </div>
          ) : (
            // if not logged in display login
            <Link href="/login">
              <li onClick={toggleMenu}>Login</li>
            </Link>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
