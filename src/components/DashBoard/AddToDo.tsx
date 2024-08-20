import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
import auth from "../../firebase.init";

interface Props {
  prop?: string;
}

const AddToDo: React.FC<Props> = () => {
  const [user] = useAuthState(auth);
  // @ts-expect-error Will Handle it


  const handleSubmit = (e) => {
    e.preventDefault();
    const leadTitle = e.target.postTitle.value;
    const content = e.target.postDescription.value;
    const device = e.target.device.value;
    const createdAt = new Date().toISOString(); 
    const lastUpdatedAt = createdAt;
    const userMatriculation = user?.email || "";
    
    const data = {
      leadTitle,
      content,
      createdAt,
      lastUpdatedAt,
      userMatriculation
    };
    const url = `https://your-backend-url.com/leads`;
    
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
        e.target.reset();
      })
      .catch((err) => {
        toast.error(err.message, { id: "adding-error" });
      });
  };
  return (
    <div>
      <form onSubmit={handleSubmit} className="py-4 flex flex-col items-center">
        // Lead Title
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

        
        <input
          type="submit"
          value="Add"
          className="btn btn-active input input-bordered w-full max-w-lg"
        />
      </form>
    </div>
  );
};

export default AddToDo;
