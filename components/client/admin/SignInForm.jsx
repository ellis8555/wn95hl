"use client";

import { useState, useRef } from "react";

function SignInForm() {
  const [name, setName] = useState(null);
  const [userPassword, setUserPassword] = useState(null);
  const [showSetPassword, setShowSetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState(null);
  const [userMessage, setUserMessage] = useState("");

  // get name input
  const nameInput = useRef();
  // get password input
  const passwordInput = useRef();
  // get set password input
  const setPasswordInput = useRef();

  // form submit button pressed
  const handleSubmit = async (e) => {
    e.preventDefault();

    // return if name is blank
    if (name == null || name === "") {
      setUserMessage(null);
      return;
    }

    // sign user in if they have admin rights
    try {
      // display correct user message depending on action
      if (showSetPassword) {
        // if user is authorized and re setting there password
        setUserMessage("Setting new password...");
      } else {
        setUserMessage("Loading...");
      }
      // get user
      const response = await fetch(`/api/coaches/get-coach?name=${name}`);
      // if no user or some other error return
      if (!response.ok) {
        const responseError = await response.json();
        throw new Error(responseError.message);
      }

      // get user details
      const user = await response.json();

      // check if user is an admin
      if (user.isAdmin) {
        // check if user has set a password
        if (user.password != undefined) {
          if (user.password !== "nhl95") {
            setUserMessage(`${user.name} your password is ${user.password}`);
          } else {
            // if password field is not blank then submit users password to be validated and saved
            if (userPassword) {
              if (userPassword === "nhl95") {
                setUserMessage("set a new password");
                setShowSetPassword(true);
                if (showSetPassword) {
                  const response = await fetch("/api/admin/register/", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      name: user.name,
                      password: newPassword,
                    }),
                  });

                  if (!response.ok) {
                    const responseError = await response.json();
                    throw new Error(responseError.message);
                  }

                  const userCredentials = await response.json();

                  setUserMessage(userCredentials.message);
                  setShowSetPassword(false);
                  setUserPassword(null);
                  setNewPassword(null);
                  setName(null);
                  nameInput.current.value = "";
                  passwordInput.current.value = "";
                }
              } else {
                throw new Error(
                  "User and password combination are not authorized"
                );
              }
            } else {
              // if admin has no password and password input field is blank
              setUserMessage("password field is blank");
              passwordInput.current.focus();
            }
          }
        } else {
          throw new Error(
            "League admin needs to assign you a temporary password"
          );
        }
      } else {
        // user is not an admin
        setName(null);
        nameInput.current.value = "";
        throw new Error("Only admins can sign in");
      }
    } catch (error) {
      setUserMessage(error.message);
    }
  };

  return (
    <div className="flex flex-col w-1/2 mx-auto mt-48">
      {userMessage && (
        <div className="text-center text-2xl mb-4 break-words">
          {userMessage}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4 w-3/4 mx-auto"
        name="adminForm"
      >
        <input
          type="text"
          ref={nameInput}
          name="name"
          className="bg-slate-600 rounded px-1 w-1/2"
          onChange={(e) => {
            setName(e.target.value);
          }}
          onFocus={() => {
            setUserMessage("");
          }}
          placeholder="name"
        />
        <input
          type="text"
          ref={passwordInput}
          name="password"
          className="bg-slate-600 rounded px-1 w-1/2"
          onChange={(e) => {
            setUserPassword(e.target.value);
          }}
          onFocus={() => {
            setUserPassword(null);
          }}
          placeholder="password"
        />
        {showSetPassword && (
          <input
            type="text"
            ref={setPasswordInput}
            name="setPassword"
            className="bg-slate-600 rounded px-1 w-1/2"
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
            onFocus={() => {
              setNewPassword(null);
            }}
            placeholder="set new password"
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
