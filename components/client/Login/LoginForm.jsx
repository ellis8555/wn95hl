"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  GET_API_WITH_PARAMS,
  POST_JSON_TO_API,
} from "@/utils/constants/data-calls/api_calls";

function LogInForm() {
  const [name, setName] = useState(null);
  const [userPassword, setUserPassword] = useState(null);
  const [showSetPassword, setShowSetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState(null);
  const [adminDefaultPassword, setAdminDefaultPassword] = useState(
    process.env.NEXT_PUBLIC_REACT_APP_DEFAULT_USER_PASSWORD
  );
  const [userMessage, setUserMessage] = useState("");

  // get name input
  const nameInput = useRef();
  // get password input
  const passwordInput = useRef();
  // get set password input
  const setPasswordInput = useRef();

  // for navigation redirects
  const router = useRouter();

  // form submit button pressed
  const handleSubmit = async (e) => {
    e.preventDefault();

    // return if name is blank
    if (name == null || name === "") {
      setUserMessage(null);
      return;
    }

    // display correct user message depending on action
    if (showSetPassword && newPassword) {
      // if user is authorized and re new password field is not blank
      setUserMessage("Setting new password...");
    } else if (showSetPassword && newPassword == null) {
      // if user is authorized and new password field is empty
      setUserMessage("new password field is blank");
      return;
    } else if (!showSetPassword) {
      setUserMessage("Loading...");
    } else {
      setUserMessage(userMessage);
    }

    // sign user in if they have admin rights
    try {
      // get user and user details
      const user = await GET_API_WITH_PARAMS(
        "coaches/get-coach",
        `name=${name}`
      );

      // check if user is an admin
      if (user.isAdmin) {
        // check if user has set a password
        if (user.password != undefined) {
          // check if user is still on default password
          if (user.password != adminDefaultPassword) {
            // all checks passed attempt to login
            const bodyObject = {
              name: user.name,
              password: userPassword,
            };

            // cookie is set here
            const response = await POST_JSON_TO_API("login", bodyObject);

            // reset state variables once before directing the user to dashboard
            setUserMessage("");
            setShowSetPassword(false);
            setUserPassword(null);
            setNewPassword(null);
            setName(null);
            nameInput.current.value = "";
            passwordInput.current.value = "";

            // finally redirect the authorized user to the dashboard
            router.push("/dashboard");
          } else {
            // if password field is not blank then submit users password to be validated and saved
            if (userPassword) {
              // if user has had default password assigned by admin and correctly enters in the password
              if (userPassword === adminDefaultPassword) {
                setUserMessage("set a new password");
                setShowSetPassword(true);
                // if user is admin, has had default password set and correctly enters it they now can reset there password
                if (showSetPassword) {
                  // if new password is entered submit it
                  if (newPassword) {
                    const bodyObject = {
                      name: user.name,
                      password: newPassword,
                    };
                    // submit new password
                    const userCredentials = await POST_JSON_TO_API(
                      "register",
                      bodyObject
                    );

                    // reset state variables once password reset is complete
                    setUserMessage(userCredentials.message);
                    setShowSetPassword(false);
                    setUserPassword(null);
                    setNewPassword(null);
                    setName(null);
                    nameInput.current.value = "";
                    passwordInput.current.value = "";
                  } else {
                    throw new Error("new password field is blank");
                  }
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
    <div className="flex flex-col">
      {userMessage && (
        <div className="text-center text-2xl mb-4 break-words">
          {userMessage}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4"
        name="adminForm"
      >
        <input
          type="text"
          ref={nameInput}
          name="name"
          className="bg-slate-600 rounded px-1 w-72"
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
          className="bg-slate-600 rounded px-1 w-72"
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
            className="bg-slate-600 rounded px-1 w-72"
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

export default LogInForm;
