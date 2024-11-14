import "./rightbar.css";
import { Users } from "../../dummyData";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useFriends } from "../../context/OnlineUsersContext";
import Online from "../online/Online";

export default function Rightbar({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const { friends, setFriends } = useFriends(); // Access friends from context
  const [followed, setFollowed] = useState(
    currentUser.followings.includes(user?._id)
  );
  const navigate = useNavigate(); // To navigate to the conversation/chat page

  useEffect(() => {
    setFollowed(currentUser.followings.includes(user?._id));
  }, [currentUser.followings, user?._id]);

  useEffect(() => {
    const getFriends = async () => {
      if (!user?._id) {
        return;
      }
      try {
        const friendList = await axios.get(
          "https://zikosocial.onrender.com/api/users/friends/" + user._id
        );
        setFriends(friendList.data); // Update friends using context's setter
      } catch (error) {
        console.error(error);
      }
    };
    getFriends();
  }, [user, setFriends]);

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put(
          "https://zikosocial.onrender.com/api/users/" + user._id + "/unfollow",
          { userId: currentUser._id }
        );
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(
          "https://zikosocial.onrender.com/api/users/" + user._id + "/follow",
          { userId: currentUser._id }
        );
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setFollowed(!followed);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMessageClick = async () => {
    try {
      const response = await axios.get(
        `https://zikosocial.onrender.com/api/conversations/find/${currentUser._id}/${user._id}`
      );

      if (!response.data) {
        // If no conversation found, create a new one
        const newConversation = await axios.post(
          "https://zikosocial.onrender.com/api/conversations/",
          {
            senderId: currentUser._id,
            receiverId: user._id,
          }
        );
        console.log("New conversation created:", newConversation.data);
        navigate(`/messenger/${newConversation.data._id}`);
      } else {
        // Navigate to the existing conversation
        console.log("Existing conversation:", response.data);
        navigate(`/messenger/${response.data._id}`);
      }
    } catch (error) {
      console.error("Error handling message click:", error);
    }
  };

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img src="/assets/gift.png" alt="" className="birthdayImg" />
          <span className="birthdayText">
            <b>Nana Ragab</b> and <b>3 other friends</b> have a birthday today.
          </span>
        </div>
        <img src="/assets/ad.png" alt="advertise" className="rightbarAd" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {friends.length > 0 ? (
            friends.map((friend) => <Online key={friend._id} user={friend} />)
          ) : (
            // <span>No online friends</span>
            <ul className="rightbarFriendList">
              {Users.map((u) => (
                <Online key={u.id} user={u} />
              ))}
            </ul>
          )}
        </ul>
      </>
    );
  };

  console.log(friends);

  const ProfileRightbar = () => {
    return (
      <>
        <div style={{ display: "flex", gap: "10px" }}>
          {user.username !== currentUser.username && (
            <button className="rightbarFollowButton" onClick={handleClick}>
              {followed ? "Unfollow" : "Follow"}
              {followed ? <RemoveIcon /> : <AddIcon />}
            </button>
          )}
          {user.username !== currentUser.username && (
            <button
              className="rightbarFollowButton"
              onClick={handleMessageClick}
            >
              Message
            </button>
          )}
        </div>
        <h4 className="rightbarProfileTitle">User Information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">
              {user?.city ? user.city : "Unknown"}
            </span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">
              {user.relationship === 1
                ? "Single"
                : user.relationship === 2
                ? "Married"
                : "-"}
            </span>
          </div>
        </div>
        <h4 className="rightbarProfileTitle">User Friends</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
            <Link
              to={"/profile/" + friend.username}
              style={{ textDecoration: "none" }}
              key={friend._id}
            >
              <div className="rightbarFollowing">
                <img
                  src={
                    friend.profilePicture
                      ? PF + friend.profilePicture
                      : `${PF}person/noAvatar.png`
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
