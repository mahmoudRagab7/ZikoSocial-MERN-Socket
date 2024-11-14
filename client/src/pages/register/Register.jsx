import { useRef, useState } from "react";
import "./register.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const Username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const profilePicture = useRef();
  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null); // State for image preview

  const history = useNavigate();

  // Handle the file change event
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Create preview URL for the selected image
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message on new attempt

    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Passwords don't match!");
    } else {
      const user = {
        username: Username.current.value,
        email: email.current.value,
        password: password.current.value,
        profilePicture: profilePicture.current.files[0], // Get the selected file
      };

      const formData = new FormData();
      formData.append("username", user.username);
      formData.append("email", user.email);
      formData.append("password", user.password);
      formData.append("profilePicture", user.profilePicture); // Append the profile picture

      try {
        await axios.post("https://zikosocial.onrender.com/api/auth/register", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Set the appropriate content-type
          },
        });
        history("/login");
      } catch (error) {
        if (error.response && error.response.data.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("An unexpected error occurred. Please try again.");
        }
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
              placeholder="Username"
              required
              ref={Username}
              className="loginInput"
            />
            <input
              placeholder="Email"
              required
              type="email"
              ref={email}
              className="loginInput"
            />
            <input
              placeholder="Password"
              required
              minLength={6}
              type="password"
              ref={password}
              className="loginInput"
            />
            <input
              placeholder="Confirm Password"
              required
              minLength={6}
              type="password"
              ref={passwordAgain}
              className="loginInput"
            />

            {/* Profile picture input */}
            <div className="profilePictureWrapper">
              <input
                type="file"
                id="profilePicture" // Add the id to the file input
                ref={profilePicture}
                accept=".png,.jpeg,.jpg"
                className="profilePictureInput"
                onChange={handleImageChange} // Trigger handleImageChange on file selection
              />
              <label htmlFor="profilePicture" className="profilePictureLabel">
                Choose Profile Picture
              </label>

              {/* Show image preview if one is selected */}
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="profilePicturePreview"
                />
              )}
            </div>

            <button
              className="loginButton"
              type="submit"
              style={{ marginTop: "10px", marginBottom: "10px" }}
            >
              Sign Up
            </button>
            {errorMessage && (
              <span
                className="registerError"
                style={{
                  color: "red",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              >
                {errorMessage}
              </span>
            )}
            <Link to={"/login"} style={{ textAlign: "center" }}>
              <button className="loginRegisterButton">
                Login into Account
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
