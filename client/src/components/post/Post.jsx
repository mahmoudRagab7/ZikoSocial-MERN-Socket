import "./post.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import axios from "axios";
import { format } from "timeago.js";
import { AuthContext } from "../../context/AuthContext";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export default function Post({ post, onDelete }) {
  // Add onDelete prop to handle post deletion
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  console.log(PF + "----");

  const { user: currentUser } = useContext(AuthContext);
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(
        `https://zikosocial.onrender.com/api/users?userId=${post.userId}`
      );
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);

  const likeHandler = () => {
    try {
      axios.put(`https://zikosocial.onrender.com/api/posts/${post._id}/like`, {
        userId: currentUser._id,
      });
    } catch (error) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  // Handle Menu
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle Delete
  const handleDelete = async () => {
    try {
      await axios.delete(`https://zikosocial.onrender.com/api/posts/${post._id}`, {
        data: { userId: currentUser._id }, // Pass the userId for authorization
      });
      onDelete(post._id); // Call the parent component's onDelete to remove the post from the UI
      navigate("/"); // Redirect to home or another page after deletion
    } catch (error) {
      console.error("Failed to delete the post", error);
    }
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`profile/${user.username}`}>
              <img
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt="profile"
                className="postProfileImg"
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div>
            <div
              className="postTopRight"
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleMenuClick}
              style={{ cursor: "pointer" }}
            >
              <MoreVertIcon />
            </div>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {post.userId === currentUser._id && (
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
              )}
            </Menu>
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img src={PF + post.img} alt="" className="postImg" />
        </div>
        <div className="postButtom">
          <div className="postButtomLeft">
            <img
              src={`${PF}like.png`}
              alt="like icon"
              className="likeIcon"
              onClick={likeHandler}
            />
            <img
              src={`${PF}heart.png`}
              alt="like icon"
              className="likeIcon"
              onClick={likeHandler}
            />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postButtomRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
