import axios from "axios";
import { useEffect, useState } from "react";
// import { useFriends } from "../../context/FriendsContext"; // Import the context hook
import { useFriends } from "../../context/OnlineUsersContext";
import "./chatOnline.css";

export default function ChatOnline({ onlineUsers, currentId, setCurrentChat }) {
  const { friends, setFriends } = useFriends(); // Get the state and setter from context
  const [onlineFriends, setOnlineFriends] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const getFriends = async () => {
      try {
        const res = await axios.get("/users/friends/" + currentId);
        setFriends(res.data); // Update friends using context's setter
      } catch (error) {
        console.log(error);
      }
    };

    getFriends();
  }, [currentId, setFriends]);

  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
  }, [friends, onlineUsers]);

  const handleClick = async (user) => {
    try {
      const res = await axios.get(
        `/conversations/find/${currentId}/${user._id}`
      );
      setCurrentChat(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chatOnline">
      {onlineFriends.length > 0 ? (
        onlineFriends.map((o) => (
          <div
            key={o._id}
            className="chatOnlineFriend"
            onClick={() => handleClick(o)}
          >
            <div className="chatOnlineImgContainer">
              <img
                className="chatOnlineImg"
                src={
                  o?.profilePicture
                    ? PF + o.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
              />
              <div className="chatOnlineBadge"></div>
            </div>
            <span className="chatOnlineName">{o?.username}</span>
          </div>
        ))
      ) : (
        <span>No online friends</span>
      )}
    </div>
  );
}
