import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthState } from "react-firebase-hooks/auth"; // Get the logged-in user
import auth from "../../firebase.init"; // Firebase authentication setup
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // FontAwesome for the like icon
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons"; // Thumbs up icon

interface PostDetailsProps {
  leadTitle: string;
  content: string;
  id: string;
  imageUrls: string[];
  likes: number; // Add likes field
  likedBy: string[]; // Track users who liked the post
}

const PostDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get post ID from URL params
  const [post, setPost] = useState<PostDetailsProps | null>(null); // State to hold post data
  const [loading, setLoading] = useState(true); // Loading state
  const [liked, setLiked] = useState(false); // State to track if the user has liked the post
  const [likesCount, setLikesCount] = useState(0); // Track the number of likes in the frontend
  const [user] = useAuthState(auth); // Get the currently logged-in user

  // Fetch post details when component mounts
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `https://unitrade-hawserver-production.up.railway.app/leads/lead-by-id/${id}`
        );
        const postData = response.data;
        setPost(postData);
        setLikesCount(postData.likes); // Set the initial likes count
        setLoading(false);

        // Check if the current user has already liked the post
        if (postData.likedBy.includes(user?.email)) {
          setLiked(true); // User has already liked this post
        }
      } catch (error) {
        toast.error("Failed to fetch post details", { id: "fetch-error" });
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user?.email]);

  // Handle like action
  const handleLike = async () => {
    if (liked) {
      toast.error("You've already liked this post!");
      return;
    }

    try {
      const response = await axios.post(
        `https://unitrade-hawserver-production.up.railway.app/leads/update/${id}`,
        { userEmail: user?.email,
          Likes: 
         } // Send the user's email to the backend
      );

      if (response.data.success) {
        setLikesCount((prevLikes) => prevLikes + 1); // Update the likes count immediately in the UI
        setLiked(true); // Mark the post as liked in the UI
        toast.success("Post liked!");
      } else if (response.data.alreadyLiked) {
        toast.error("You've already liked this post!");
        setLiked(true); // Even if the backend indicates, mark it as liked
      }
    } catch (error) {
      toast.error("Failed to like the post", { id: "like-error" });
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!post) {
    return <p>No post found!</p>;
  }

  return (
    <div className="text-center">
      <h2>{post.leadTitle}</h2>
      <p>{post.content}</p>

      {/* Image rendering */}
      {post.imageUrls.length > 0 && (
        <div className="flex justify-center mt-5">
          <img
            src={post.imageUrls[0]}
            alt={post.leadTitle}
            className="max-w-xs w-full h-auto rounded-lg"
          />
        </div>
      )}

      {/* Display the number of likes */}
      <div className="mt-4">
        <p>{likesCount} {likesCount === 1 ? "Like" : "Likes"}</p>

        {/* Like Button with Icon */}
        <button
          onClick={handleLike}
          className={`mt-2 px-4 py-2 ${liked ? "bg-gray-500" : "bg-blue-500"} text-white rounded`}
          disabled={liked} // Disable if the user has already liked
        >
          <FontAwesomeIcon icon={faThumbsUp} /> {/* Thumbs up icon */}
        </button>
      </div>
    </div>
  );
};

export default PostDetails;
