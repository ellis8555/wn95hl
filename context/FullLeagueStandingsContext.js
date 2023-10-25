"use client";

import { createContext, useContext, useState } from "react";

const FullLeagueStandingsContext = createContext();

function LeagueStandingsProvider({ children }) {
  const [clientSideStandings, setClientSideStandings] = useState({});
  const [refreshTheStandings, setRefreshTheStandings] = useState(false);
  const [clientRecentlyPlayedGames, setClientRecentlyPlayedGames] =
    useState(null);

  return (
    <FullLeagueStandingsContext.Provider
      value={{
        clientSideStandings,
        setClientSideStandings,
        refreshTheStandings,
        setRefreshTheStandings,
        clientRecentlyPlayedGames,
        setClientRecentlyPlayedGames,
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
