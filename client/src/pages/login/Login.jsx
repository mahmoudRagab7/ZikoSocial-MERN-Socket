import { useContext, useRef, useState } from "react";
import "./login.css";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";

export default function Login() {
  const email = useRef();
  const password = useRef();
  const { isFetching, dispatch } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState(""); // State to store the error message

  const handleClick = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message on new login attempt

    try {
      await loginCall(
        { email: email.current.value, password: password.current.value },
        dispatch
      );
    } catch (error) {
      // Check if the error response exists and set the message accordingly
      if (
        error.response &&
        (error.response.status === 404 || error.response.status === 400)
      ) {
        setErrorMessage("Wrong email or password");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Zikosocial</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Zikosocial.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="Email"
              type="email"
              required
              className="loginInput"
              ref={email}
            />
            <input
              placeholder="Password"
              type="password"
              required
              minLength={6}
              className="loginInput"
              ref={password}
            />
            <button className="loginButton" type="submit" disabled={isFetching}>
              {isFetching ? (
                <CircularProgress color="white" size={"20px"} />
              ) : (
                "Login"
              )}
            </button>
            {errorMessage && (
              <span
                className="loginError"
                style={{ color: "red", marginTop: "10px" }}
              >
                {errorMessage}
              </span>
            )}
            <span className="loginForgot">Forgot Password?</span>
            <Link to={"/register"} style={{ textAlign: "center" }}>
              <button className="loginRegisterButton">
                {isFetching ? (
                  <CircularProgress color="white" size={"20px"} />
                ) : (
                  "Create a New Account"
                )}
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
