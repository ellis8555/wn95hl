"use client";

import "./styles.css";
import Link from "next/link";
import GeneralLogo from "@/components/server/Logos/GeneralLogo";
import LeagueLogo from "@/components/server/Logos/LeagueLogo";
import {
  MOST_RECENT_SEASON,
  MOST_RECENT_Q_SEASON,
} from "@/utils/constants/constants";
import { useState } from "react";
import { useFullLeagueStandings } from "@/context/FullLeagueStandingsContext";
import { useAuthorizationStatus } from "@/context/UserAuthContext";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { FaHockeyPuck } from "react-icons/fa";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setLeagueContext, setSeasonNumberContext } = useFullLeagueStandings();
  const { isAuthorized } = useAuthorizationStatus();

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <div className="relative sticky top-0 w-full">
      {/*  desktop menu */}
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
          <li
            className="hover:cursor-pointer"
            onClick={() => {
              setLeagueContext("w");
              setSeasonNumberContext(MOST_RECENT_SEASON);
            }}
          >
            <LeagueLogo name={"w"} width={25} height={25} />
          </li>
          <li
            className="hover:cursor-pointer mr-4"
            onClick={() => {
              setLeagueContext("q");
              setSeasonNumberContext(MOST_RECENT_Q_SEASON);
            }}
          >
            <LeagueLogo name={"q"} width={25} height={25} />
          </li>
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
          <Link href={"/recent-scores/w"}>
            <li
              onClick={() => {
                toggleMenu();
                setLeagueContext("w");
                setSeasonNumberContext(MOST_RECENT_SEASON);
              }}
            >
              W_Scores
            </li>
          </Link>
          <Link href={"/recent-scores/q"}>
            <li
              onClick={() => {
                toggleMenu();
                setLeagueContext("q");
                setSeasonNumberContext(MOST_RECENT_Q_SEASON);
              }}
            >
              Q_Scores
            </li>
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
