"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { AUTH_COOKIE } from "@/utils/constants";

const GetAuthorizationStatus = createContext();

function UserAuthContextProvider({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const getCookie = document.cookie;
    const isUserAuthCookie = getCookie.split("=")[0];
    if (isUserAuthCookie == AUTH_COOKIE) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  }, [isAuthorized]);

  return (
    <GetAuthorizationStatus.Provider value={{ isAuthorized, setIsAuthorized }}>
      {children}
    </GetAuthorizationStatus.Provider>
  );
}
function useAuthorizationStatus() {
  const context = useContext(GetAuthorizationStatus);

  if (!context) throw new Error("Not inside of Auth Provider");

  return context;
}

export { UserAuthContextProvider, useAuthorizationStatus };
