"use client";

import { useAuthorizationStatus } from "@/context/userAuthContext";
import SignInForm from "@/components/client/admin/SignInForm";
import SignOut from "@/components/server/admin/sign-out";

function SignIn() {
  const { isAuthorized } = useAuthorizationStatus();

  return (
    <>
      <div className="text-2xl text-center mt-6 text-orange-400">
        Admin login
      </div>
      {isAuthorized ? <SignOut /> : <SignInForm />}
    </>
  );
}

export default SignIn;
