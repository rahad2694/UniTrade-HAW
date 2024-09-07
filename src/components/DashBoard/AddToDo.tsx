import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
import auth from "../../firebase.init";
import axios from "axios";

interface Props {
  prop?: string;
}

const AddToDo: React.FC<Props> = () => {
  const [user] = useAuthState(auth);
  const [userMatriculation, setUserMatriculation] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
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
        // toast.success("Matriculation got successfully");
      })
      .catch((err) => {
        toast.error(err.message, { id: "adding-error" });
      });
  }, [user?.email]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const leadTitle = e.currentTarget.postTitle.value;
    const content = e.currentTarget.postDescription.value;
    const createdAt = new Date().toISOString();
    const lastUpdatedAt = createdAt;

    const data = {
      leadTitle,
      content,
      createdAt,
      lastUpdatedAt,
      userMatriculation,
    };
    const url = `https://unitrade-hawserver-production.up.railway.app/leads/create-lead`;

    fetch(url, {
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
        // e.currentTarget.reset();
      })
      .catch((err) => {
        toast.error(err.message, { id: "adding-error" });
      });
  };
  // Handle image selection
  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  // Handle image upload
  const handleImageUpload = async () => {
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
            key: "YOUR_IMAGEBB_API_KEY", // Replace with your actual ImageBB API key
          },
        }
      );

      setLoading(false);

      // Get the image URL from the response
      const url = response.data.data.url;
      setImageUrl(url);
      alert("Image uploaded successfully!");
    } catch (error) {
      setLoading(false);
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    }
  };
  !loading && console.log(imageUrl);
  return (
    <div>
      <form onSubmit={handleSubmit} className="py-4 flex flex-col items-center">
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
        {/* Image input */}
        <input type="file" onChange={handleImageChange} accept="image/*" />

        <input
          type="submit"
          value="Add"
          className="btn btn-active input input-bordered w-full max-w-lg hover:bg-red-500"
        />
      </form>
    </div>
  );
};

export default AddToDo;
