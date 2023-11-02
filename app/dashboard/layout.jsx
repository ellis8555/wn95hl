"use client";

import { useEffect } from "react";
import { useAuthorizationStatus } from "@/context/UserAuthContext";
import { useRouter } from "next/navigation";
import { DOMAIN } from "@/utils/constants/connections";

function DashboardLayout({ children }) {
  const { isAuthorized, setIsAuthorized } = useAuthorizationStatus();

  const router = useRouter();

  // validate user before displaying dashbard pate
  useEffect(() => {
    (async () => {
      const { user, error } = await getUser();

      if (error) {
        router.push("/login");
        return;
      }
      setIsAuthorized(true);
    })();
  }, [router]);

  if (!isAuthorized) {
    return <p className="text-slate-300 text-center">Authorizing...</p>;
  }

  return <div className="text-slate-300">{children}</div>;
}

async function getUser() {
  try {
    const response = await fetch(`${DOMAIN}/api/auth`);

    if (!response.ok) {
      setIsAuthorized(false);
    }

    const data = await response.json();

    return {
      user: data,
      error: null,
    };
  } catch (error) {
    return {
      user: null,
      error: error.message,
    };
  }
}

export default DashboardLayout;
