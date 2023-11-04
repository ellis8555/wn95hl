"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { GET_API } from "@/utils/constants/data-calls/api_calls";
import { AUTH_COOKIE } from "@/utils/constants/constants";

const GetAuthorizationStatus = createContext();

function UserAuthContextProvider({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    (async () => {
      const getCookie = document.cookie;
      if (getCookie == "") {
        setIsAuthorized(false);
      } else {
        const isUserAuthCookie = getCookie.split("=")[0];
        if (isUserAuthCookie == AUTH_COOKIE) {
          // veryify the cookie has not been tampered with
          const response = await GET_API("auth");
          // if cookie does not pass check
          if (!response.ok) {
            setIsAuthorized(false);
          }
          // cookie verified
          setIsAuthorized(true);
        }
      }
    })();
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
