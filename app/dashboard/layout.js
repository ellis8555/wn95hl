"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function DashboardLayout({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
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
      <p>This is the layout page!</p>
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
