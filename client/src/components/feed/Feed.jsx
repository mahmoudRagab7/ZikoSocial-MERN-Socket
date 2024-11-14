import { useContext, useEffect, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useLocation } from "react-router-dom"; // Import useLocation

export default function Feed({ username }) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);
  const location = useLocation(); // Use useLocation to get the current route

  useEffect(() => {
    const fetchPosts = async () => {
      let res;

      if (location.pathname === "/timeline") {
        // Fetch posts for timeline (user's posts)
        res = await axios.get(
          "https://zikosocial.onrender.com/api/posts/timeline/" + user._id
        );
      } else if (username) {
        // Fetch posts for a specific user's profile
        res = await axios.get(
          "https://zikosocial.onrender.com/api/posts/profile/" + username
        );
      } else {
        // Fetch posts for home page (general feed)
        res = await axios.get("https://zikosocial.onrender.com/api/posts/");
      }

      setPosts(
        // Sort posts by creation date
        res.data.sort(
          (p1, p2) => new Date(p2.createdAt) - new Date(p1.createdAt)
        )
      );
    };

    fetchPosts();
  }, [location.pathname, username, user._id]); // Re-run effect when route or user changes

  const handleDeletePost = (postId) => {
    // Remove the post from the state after deletion
    setPosts(posts.filter((post) => post._id !== postId));
  };

  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username === user.username) && <Share />}
        {posts.map((p) => (
          <Post key={p._id} post={p} onDelete={handleDeletePost} />
        ))}
      </div>
    </div>
  );
}
