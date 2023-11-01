"use client";

import { useAuthorizationStatus } from "@/context/UserAuthContext";
import { useRouter } from "next/navigation";
import nextResponse from "@/utils/api/next-response";

function SignOut() {
  const { setIsAuthorized } = useAuthorizationStatus();
  const router = useRouter();

  async function logout() {
    try {
      const response = await fetch("/api/logout");

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.message);
      }

      const logoutMessage = await response.json();
      alert(logoutMessage.message);
      setIsAuthorized(false);
      router.push("/");
    } catch (error) {
      return nextResponse({ message: error.message }, 500, "GET");
    }
  }

  return (
    <div className="flex justify-center">
      <button
        className="w-min p-1 mt-10 rounded-md bg-orange-500"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}

export default SignOut;
