import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../firebase.init";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { LeadType } from "./DashBoard";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import AddTodoModal from "./AddTodoModal";

const PostDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/dashboard";
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<LeadType | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [user] = useAuthState(auth);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `https://unitrade-hawserver-production.up.railway.app/leads/lead-by-id/${id}`
        );
        const postData = response.data;
        setPost(postData);
        setLikesCount(postData.likes);
        setLoading(false);

        // Check if the current user has already liked the post
        if (postData?.likedBy?.includes(user?.email)) {
          setLiked(true);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch post details", { id: "fetch-error" });
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user?.email, refetch]);

  // Handle like action
  const handleLike = async () => {
    if (liked) {
      toast.error("You've already liked this post!");
      return;
    }

    try {
      const response = await axios.post(
        `https://unitrade-hawserver-production.up.railway.app/leads/${id}/like`,
        {
          email: user?.email,
        }
      );

      if (response.data.success) {
        setLikesCount((prevLikes) => prevLikes + 1);
        setLiked(true);
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

  const noImageSrc = "https://i.ibb.co/ZMYzS6R/no-image.jpg";
  const img =
    post?.imageUrls?.length && post?.imageUrls[0] != ""
      ? post?.imageUrls[0]
      : noImageSrc;

  const handleRefetch = () => {
    setRefetch(!refetch);
  };
  function handleClose() {
    setShowAddModal(false);
  }

  const handleEdit = () => {
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    const proceed = window.confirm("Are you sure to delete?");
    if (proceed) {
      axios
        .delete(
          `https://unitrade-hawserver-production.up.railway.app/leads/delete/${user?.email}/${id}`
        )
        .then((response) => {
          toast.success("Successfully Deleted " + response.statusText, {
            id: "deleted",
          });
          handleRefetch();
          navigate(from, { replace: true });
        })
        .catch((error) => {
          if (error.response.status === 403) {
            toast.error("You Can't delete this Post", {
              id: "delete-access-error",
            });
          } else {
            toast.error(error.message, { id: "delete-error" });
          }
        });
    } else {
      toast.success("Attempt Terminated", { id: "delete-cancel" });
    }
  };

  return (
    <div className="w-1/2 mx-auto">
      <AddTodoModal
        showModal={showAddModal}
        handleClose={handleClose}
        handleRefetch={handleRefetch}
        lead={post}
      ></AddTodoModal>
      {post?.imageUrls?.length > 1 ? (
        <div className="carousel w-96 h-80 overflow-hidden">
          {post?.imageUrls?.map((url, index) => (
            <div id={`slide${index}`} className="carousel-item relative w-full">
              <img className="w-full h-full object-cover" src={url} alt="" />

              <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a
                  href={`#slide${
                    index === 0 ? post.imageUrls.length - 1 : index - 1
                  }`}
                  className="btn btn-circle"
                >
                  ❮
                </a>
                <a
                  href={`#slide${
                    index === post.imageUrls.length - 1 ? 0 : index + 1
                  }`}
                  className="btn btn-circle"
                >
                  ❯
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-96 overflow-hidden mx-auto">
          <div className="relative w-full">
            <img className="w-full h-full object-cover" src={img} alt="" />
          </div>
        </div>
      )}

      <h2 className="text-bold text-lg my-4 text-blue-600">
        {post?.leadTitle}
      </h2>
      <p className="text-xs md:text-base text-justify">{post?.content}</p>
      {/* Display the number of likes */}
      <div className="my-4">
        <p className="my-2">
          {likesCount ?? 0} {likesCount && likesCount > 1 ? "Likes" : "Like"}
        </p>

        <div className="flex justify-center align-middle">
          {/* Like Button with Icon */}
          <button
            onClick={handleLike}
            className={`btn text-white ${
              liked ? "bg-gray-500" : "bg-blue-500"
            }`}
            disabled={liked} // Disable if the user has already liked
          >
            <FontAwesomeIcon icon={faThumbsUp} /> {/* Thumbs up icon */}
          </button>

          <button
            title="Edit?"
            onClick={() => handleEdit()}
            className="btn text-white bg-blue-500 ml-2"
            disabled={user?.email !== post.userEmail}
          >
            <FontAwesomeIcon icon={faPen} />
          </button>
          <button
            onClick={() => handleDelete(post.id)}
            className="btn bg-red-500 text-white ml-2"
            title="Delete?"
            disabled={user?.email !== post.userEmail}
          >
            <FontAwesomeIcon className="text-xl" icon={faXmark} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
