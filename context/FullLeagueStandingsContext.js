"use client";

import { createContext, useContext, useState } from "react";
import { DEFAULT_LEAGUE } from "@/utils/constants/constants";

const FullLeagueStandingsContext = createContext();

function LeagueStandingsProvider({ children }) {
  const [clientSideStandings, setClientSideStandings] = useState({});
  const [refreshTheStandings, setRefreshTheStandings] = useState(false);
  const [clientRecentlyPlayedGames, setClientRecentlyPlayedGames] =
    useState(null);
  const [league, setLeague] = useState(DEFAULT_LEAGUE);

  return (
    <FullLeagueStandingsContext.Provider
      value={{
        clientSideStandings,
        setClientSideStandings,
        refreshTheStandings,
        setRefreshTheStandings,
        clientRecentlyPlayedGames,
        setClientRecentlyPlayedGames,
        league,
        setLeague,
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
