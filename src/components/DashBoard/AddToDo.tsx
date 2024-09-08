import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
import auth from "../../firebase.init";
import axios from "axios";
import Spinners from "../Spinners/Spinners";

interface Props {
  prop?: string;
  handleClose: () => void;
  handleRefetch: () => void;
}

const AddToDo: React.FC<Props> = ({ handleClose, handleRefetch }) => {
  const [user] = useAuthState(auth);
  const [userMatriculation, setUserMatriculation] = useState(0);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const url = `https://unitrade-hawserver-production.up.railway.app/user/email/${user?.email}`;

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `${user?.email} ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setUserMatriculation(res.matriculation);
      })
      .catch((err) => {
        toast.error(err.message + "na na an", { id: "adding-error" });
      });
  }, [user?.email]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const leadTitle = e.currentTarget.postTitle.value;
    const content = e.currentTarget.postDescription.value;
    const createdAt = new Date().toISOString();
    const lastUpdatedAt = createdAt;

    const imageUrl = await handleImageUpload();
    const data = {
      leadTitle,
      content,
      createdAt,
      lastUpdatedAt,
      userEmail: user?.email,
      userMatriculation,
      imageUrls: [imageUrl],
    };
    const url = `http://localhost:8080/leads/create-lead`;

    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `${user?.email} ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        toast.success("Post added successfully");
        handleRefetch();
        handleClose();
      })
      .catch((err) => {
        toast.error(err.message, { id: "adding-error" });
      });
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // Handle image upload
  const handleImageUpload = async () => {
    let url = "";
    if (!selectedImage) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      setLoading(true);

      // Upload the image to ImageBB
      const response = await axios.post(
        "https://api.imgbb.com/1/upload",
        formData,
        {
          params: {
            key: import.meta.env.VITE_imageBbApiKey,
          },
        }
      );
      setLoading(false);
      url = response.data.data.url;
    } catch (error) {
      setLoading(false);
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    }
    return url;
  };
  return (
    <div>
      <form onSubmit={handleSubmit} className="py-4 flex flex-col items-center">
        {!loading ? (
          <>
            <input
              type="text"
              placeholder="Post Title"
              name="postTitle"
              className="input input-bordered w-full max-w-lg mb-4"
            />
            <textarea
              placeholder="Post Description"
              name="postDescription"
              className="input input-bordered w-full max-w-lg mb-4"
            />

            {/* Label for image input */}
            <label
              htmlFor="imageInput"
              className="block mb-2 text-lg font-medium text-gray-700"
            >
              Select an Image:
            </label>
            {/* Image input */}
            <input
              className="input input-bordered w-full max-w-lg mb-4"
              type="file"
              onChange={handleImageChange}
              accept="image/*"
            />
          </>
        ) : (
          <Spinners></Spinners>
        )}
        <input
          type="submit"
          value="Add Post"
          className="btn btn-active input input-bordered w-full max-w-lg hover:bg-red-500"
        />
      </form>
    </div>
  );
};

export default AddToDo;
