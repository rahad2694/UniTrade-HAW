import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // To extract the post ID from URL
import axios from "axios";
import toast from "react-hot-toast";

interface PostDetailsProps {
  leadTitle: string;
  content: string;
  id: string;
  imageUrls: string[];
}

const PostDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get post ID from the URL params
  const [post, setPost] = useState<PostDetailsProps | null>(null); // State to hold the post data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `https://unitrade-hawserver-production.up.railway.app/leads/lead-by-id/${id}` // Ensure the URL is correct
        );
        setPost(response.data); // Set the post data
        setLoading(false); // Stop the loading state
      } catch (error) {
        toast.error("Failed to fetch post details", { id: "fetch-error" });
        setLoading(false); // Stop the loading state even if there's an error
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!post) {
    return <p>No post found!</p>;
  }

  return (
    <div style={{ textAlign: "center" }}> {/* Center-align the text */}
      <h2>{post.leadTitle}</h2>
      <p>{post.content}</p>
      {post.imageUrls.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <img
            src={post.imageUrls[0]}
            alt={post.leadTitle}
            style={{
              maxWidth: "500px", // Set a max width for the image
              width: "100%", // Responsive
              height: "auto", // Keep aspect ratio
              borderRadius: "10px", // Optional: adds rounded corners
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PostDetails;
