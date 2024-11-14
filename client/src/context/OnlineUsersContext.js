import { createContext, useState, useContext } from "react";

// Create the context
const FriendsContext = createContext();

// Create a provider component
export const FriendsProvider = ({ children }) => {
  const [friends, setFriends] = useState([]);

  return (
    <FriendsContext.Provider value={{ friends, setFriends }}>
      {children}
    </FriendsContext.Provider>
  );
};

// Custom hook to use the context
export const useFriends = () => useContext(FriendsContext);
