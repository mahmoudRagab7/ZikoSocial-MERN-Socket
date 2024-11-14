import { useContext } from "react";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Messenger from "./pages/messenger/Messenger";
import Timeline from "./pages/timeline/Timeline";
import { FriendsProvider } from "./context/OnlineUsersContext";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <FriendsProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={user ? <Home /> : <Register />} />
            <Route
              path="/login"
              element={user ? <Navigate to="/" /> : <Login />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/" /> : <Register />}
            />
            <Route
              path="/timeline/"
              element={!user ? <Navigate to="/" /> : <Timeline />}
            />
            <Route
              path="/messenger"
              element={!user ? <Navigate to="/" /> : <Messenger />}
            />
            {/* New route for Messenger with conversation ID */}
            <Route
              path="/messenger/:conversationId"
              element={!user ? <Navigate to="/" /> : <Messenger />}
            />
            <Route path="/profile/:username" element={<Profile />} />
          </Routes>
        </Router>
      </div>
    </FriendsProvider>
  );
}

export default App;
