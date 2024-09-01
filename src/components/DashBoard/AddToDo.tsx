import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
import auth from "../../firebase.init";

interface Props {
  prop?: string;
}

const AddToDo: React.FC<Props> = () => {
  const [user] = useAuthState(auth);
  const [userMatriculation, setUserMatriculation] = useState(0);

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
