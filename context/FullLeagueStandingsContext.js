"use client";

import { createContext, useContext, useState } from "react";
import {
  DEFAULT_LEAGUE,
  MOST_RECENT_SEASON,
} from "@/utils/constants/constants";

const FullLeagueStandingsContext = createContext();

function LeagueStandingsProvider({ children }) {
  const [clientSideStandings, setClientSideStandings] = useState({});
  const [refreshTheStandings, setRefreshTheStandings] = useState(false);
  const [clientRecentlyPlayedGames, setClientRecentlyPlayedGames] =
    useState(null);
  const [leagueContext, setLeagueContext] = useState(DEFAULT_LEAGUE);
  const [seasonNumberContext, setSeasonNumberContext] =
    useState(MOST_RECENT_SEASON);
    const [isTableFilteredContext, setIsTableFilteredContext] = useState(false)
    const [divisionsContext, setDivisionsContext] = useState({})
    const [conferenceNameContext, setConferenceNameContext] = useState("")

  return (
    <FullLeagueStandingsContext.Provider
      value={{
        clientSideStandings,
        setClientSideStandings,
        refreshTheStandings,
        setRefreshTheStandings,
        clientRecentlyPlayedGames,
        setClientRecentlyPlayedGames,
        leagueContext,
        setLeagueContext,
        seasonNumberContext,
        setSeasonNumberContext,
        isTableFilteredContext,
        setIsTableFilteredContext,
        divisionsContext,
        setDivisionsContext,
        conferenceNameContext,
        setConferenceNameContext
      }}
    >
      {children}
    </FullLeagueStandingsContext.Provider>
  );
}

function useFullLeagueStandings() {
  return useContext(FullLeagueStandingsContext);
}

export { LeagueStandingsProvider, useFullLeagueStandings };
