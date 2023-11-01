"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

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

    // sign user in if they have admin rights
    try {
      // display correct user message depending on action
      if (showSetPassword && newPassword) {
        // if user is authorized and re new password field is not blank
        setUserMessage("Setting new password...");
      } else if (showSetPassword && newPassword == null) {
        // if user is authorized and new password field is empty
        setUserMessage("new password field is blank");
      } else if (!showSetPassword) {
        setUserMessage("Loading...");
      } else {
        setUserMessage(userMessage);
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
          // check if user is still on default password
          if (user.password != adminDefaultPassword) {
            // all checks passed attempt to login
            const response = await fetch("/api/admin/login/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: user.name,
                password: userPassword,
              }),
            });

            // user not authenticated
            if (!response.ok) {
              const responseError = await response.json();
              throw new Error(responseError.message);
            }

            const getAuthResponse = await fetch("/api/admin/auth");
            // user not authenticated
            if (!getAuthResponse.ok) {
              const responseError = await getAuthResponse.json();
              throw new Error(responseError.message);
            }

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
                  if (newPassword) {
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
    <div className="flex flex-col mt-48">
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
