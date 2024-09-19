import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
import auth from "../../firebase.init";
import axios from "axios";
import Spinners from "../Spinners/Spinners";
import { LeadType } from "./DashBoard";

interface Props {
  handleClose: () => void;
  handleRefetch: () => void;
  lead?: LeadType;
}

const AddToDo: React.FC<Props> = ({ handleClose, handleRefetch, lead }) => {
  const [user] = useAuthState(auth);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | undefined>("");
  const [formData, setFormData] = useState({
    leadTitle: "",
    content: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const leadTitle = formData.leadTitle;
    const content = formData.content;
    const createdAt = new Date().toISOString();
    const lastUpdatedAt = createdAt;

    const imageUrls = lead?.imageUrls ?? [];
    if (uploadedImage) {
      imageUrls.push(uploadedImage);
    }
    const data = {
      leadTitle,
      content,
      createdAt,
      lastUpdatedAt,
      userEmail: user?.email,
      imageUrls: imageUrls,
    };
    const url = `https://unitrade-hawserver-production.up.railway.app/leads/${
      lead ? "update/" + lead.id : "create-lead"
    }`;

    await fetch(url, {
      method: lead ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `${user?.email} ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        toast.success("Post added successfully");
        setUploadedImage("");
        handleRefetch();
        handleClose();
      })
      .catch((err) => {
        toast.error(err.message, { id: "adding-error" });
      });
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadedImage("");
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // Handle image upload
  const handleImageUpload = async () => {
    let url = "";
    if (!selectedImage) {
      toast.error("No Image Selected!", { id: "image-error" });
      // alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      setLoading(true);

      const response = await axios.post(
        "https://api.imgbb.com/1/upload",
        formData,
        {
          params: {
            key: "928ea6a2282006669a8bf2e1f9f8ae7e",
          },
        }
      );
      url = response.data.data.url;
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    }
    return url;
  };

  useEffect(() => {
    setFormData({
      leadTitle: lead?.leadTitle || "",
      content: lead?.content || "",
    });
  }, [lead]);

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  async function handleSetImageUpload() {
    if (!uploadedImage && selectedImage) {
      setUploadedImage(await handleImageUpload());
    }
  }
  useEffect(() => {
    setUploadedImage("");
    handleSetImageUpload();
  }, [selectedImage]);
  return (
    <div>
      <form onSubmit={handleSubmit} className="py-4 flex flex-col items-center">
        {!loading ? (
          <>
            <input
              value={formData.leadTitle}
              onChange={handleChange}
              type="text"
              placeholder="Post Title"
              name="leadTitle"
              className="input input-bordered w-full max-w-lg mb-4"
            />
            <textarea
              value={formData.content}
              onChange={handleChange}
              placeholder="Post Description"
              name="content"
              className="input input-bordered w-full max-w-lg mb-4"
            />

            {/* Existing Images */}
            {lead ? (
              <label
                htmlFor="imageInput"
                className="block mb-2 text-lg font-medium text-gray-700"
              >
                Existing Images: {lead.imageUrls.length ?? 0}
              </label>
            ) : null}
            {lead?.imageUrls.length ? (
              <div
                className={`grid gap-4 ${
                  lead?.imageUrls.length >= 4
                    ? "grid-cols-4"
                    : lead?.imageUrls.length >= 3
                    ? "grid-cols-3"
                    : lead?.imageUrls.length >= 2
                    ? "grid-cols-2"
                    : "grid-cols-1"
                }`}
              >
                {lead?.imageUrls?.map((url, index) => (
                  <img
                    key={index}
                    className="rounded-t-lg w-20 h-20"
                    src={url}
                    alt=""
                  />
                ))}
              </div>
            ) : null}

            {/* Image input */}
            <label
              htmlFor="imageInput"
              className="block mb-2 text-lg font-medium text-gray-700"
            >
              {lead && lead.imageUrls.length
                ? "Add another Image:"
                : "Select Image File:"}
            </label>
            <input
              className="input input-bordered w-full max-w-lg mb-4"
              type="file"
              onChange={handleImageChange}
              accept="image/*"
            />
            {uploadedImage ? (
              <>
                <label
                  htmlFor="imageInput"
                  className="block mb-2 text-lg font-medium text-gray-700"
                >
                  Newly Uploaded Image:
                </label>
                <div className="mb-5">
                  <img
                    className="rounded-t-lg w-20 h-20"
                    src={uploadedImage}
                    alt=""
                  />
                </div>
              </>
            ) : null}
          </>
        ) : (
          <Spinners></Spinners>
        )}
        <input
          type="submit"
          value={lead ? "Update" : "Add Post"}
          className="btn btn-active input input-bordered w-full max-w-lg hover:bg-red-500"
        />
      </form>
    </div>
  );
};

export default AddToDo;
