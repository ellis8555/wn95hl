"use client";

import { useState, useRef, useEffect } from "react";

function SignInForm() {
  const [userName, setUserName] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // get name input
  const userNameInput = useRef();
  // get password input
  const passwordInput = useRef();

  useEffect(() => {
    setResponseMessage("");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userName == null || userName === "") {
      setIsAdmin(false);
      setResponseMessage(null);
      return;
    }

    try {
      setResponseMessage("Loading...");
      const response = await fetch(`/api/coaches/get-coach?name=${userName}`);
      if (!response.ok) {
        const responseError = await response.json();
        throw new Error(responseError.message);
      }

      const data = await response.json();

      if (data.isAdmin) {
        setIsAdmin(true);
        setResponseMessage(`Admin ${data.name}`);
      } else {
        setIsAdmin(false);
        setUserName(null);
        userNameInput.current.value = "";
        throw new Error("Only admins can sign in");
      }
    } catch (error) {
      setIsAdmin(false);
      setResponseMessage(error.message);
    }
  };

  return (
    <div className="flex flex-col w-1/2 mx-auto mt-48">
      {responseMessage && (
        <div className="text-center text-2xl mb-4">{responseMessage}</div>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4 w-3/4 mx-auto"
      >
        <input
          type="text"
          ref={userNameInput}
          name="userName"
          className="bg-slate-600 rounded px-1 w-1/2"
          onChange={(e) => {
            setUserName(e.target.value);
          }}
          onFocus={() => {
            setResponseMessage("");
          }}
          placeholder="username"
        />

        {isAdmin && (
          <input
            type="text"
            ref={passwordInput}
            name="password"
            className="bg-slate-600 rounded px-1 w-1/2"
            placeholder="password"
          />
        )}

        <button type="submit" className="w-min p-1 rounded-md bg-orange-500">
          Submit
        </button>
      </form>
    </div>
  );
}

export default SignInForm;
