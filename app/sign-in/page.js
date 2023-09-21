"use client";
import { useContext } from "react";

import { GetAuthorizationStatus } from "../layout";
import SignInForm from "@/components/client/admin/SignInForm";

function SignIn() {
  const { isAuthorized } = useContext(GetAuthorizationStatus);

  return (
    <>
      <div className="text-2xl text-center mt-6 text-orange-400">
        Admin login
      </div>
      {isAuthorized ? (
        <div className="flex justify-center">
          <button className="w-min p-1 mt-10 rounded-md bg-orange-500">
            Logout
          </button>
        </div>
      ) : (
        <SignInForm />
      )}
    </>
  );
}

export default SignIn;
