import axios from "axios";

export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post(
      "https://zikosocial.onrender.com/api/auth/login",
      userCredential
    );
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
  } catch (error) {
    dispatch({ type: "LOGIN_FAILURE", payload: error });
    // Explicitly throw the error so it can be caught in the calling component
    throw error;
  }
};
