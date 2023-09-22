"use client";

import { useEffect, useContext } from "react";
import { GetAuthorizationStatus } from "../layout";
import { useRouter } from "next/navigation";

function DashboardLayout({ children }) {
  const { isAuthorized, setIsAuthorized } = useContext(GetAuthorizationStatus);

  const router = useRouter();

  // validate user before displaying dashbard pate
  useEffect(() => {
    (async () => {
      const { user, error } = await getUser();

      if (error) {
        router.push("/sign-in");
        return;
      }
      setIsAuthorized(true);
    })();
  }, [router]);

  if (!isAuthorized) {
    return <p>Authorizing...</p>;
  }

  return (
    <div>
      <p>This is the dashboard layout page!</p>
      {children}
    </div>
  );
}

async function getUser() {
  try {
    const response = await fetch("/api/admin/auth");

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
