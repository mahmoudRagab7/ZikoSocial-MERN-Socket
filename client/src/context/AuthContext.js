import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

// const INITIAL_STATE = {
//   user: {
//     _id: "6722334c9e7ce2a7b216c98b",
//     username: "mahmoud",
//     email: "mahmoud@gmail.com",
//     profilePicture: "person/1.jpeg",
//     coverPicture: "",
//     isAdmin: false,
//     followers: [],
//     followings: [],
//     desc: "Welcom to Mahmoud's page",
//   },
//   isFetching: false,
//   error: false,
// };
const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isFetching: false,
  error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
