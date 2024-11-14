import { useEffect, useState } from "react";
import "./conversation.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Conversation({ conversation, currentUser }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Import the navigation hook

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);
    const getUser = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8800/api/users/?userId=" + friendId
        );
        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [conversation, currentUser]);

  // Handle conversation click
  const handleConversationClick = () => {
    if (user?._id) {
      // Navigate to the URL with the selected user's ID
      navigate(`/messenger/${user._id}`);
    }
  };

  return (
    <div className="conversation" onClick={handleConversationClick}>
      <img
        src={
          user?.profilePicture
            ? PF + user.profilePicture
            : PF + "person/noAvatar.png"
        }
        alt="conversationImg"
        className="conversationImg"
      />
      <span className="conversationName">{user?.username}</span>
    </div>
  );
}
