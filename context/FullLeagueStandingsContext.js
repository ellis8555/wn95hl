"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const FullLeagueStandingsContext = createContext();

function LeagueStandingsProvider({ children }) {
  const [clientSideStandings, setClientSideStandings] = useState({});
  const [refreshTheStandings, setRefreshTheStandings] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (refreshTheStandings) {
      router.refresh();
    }
  }, [clientSideStandings]);

  return (
    <FullLeagueStandingsContext.Provider
      value={{
        clientSideStandings,
        setClientSideStandings,
        refreshTheStandings,
        setRefreshTheStandings,
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
