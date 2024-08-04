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
    const taskName = e.target.name.value;
    const taskDescription = e.target.description.value;
    const data = { taskName, taskDescription, email: user?.email };
    console.log(data);
    const url = `https://simple-to-do-app-server.herokuapp.com/addtodo`;
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
        <input
          type="text"
          placeholder="Post Title"
          name="postName"
          className="input input-bordered w-full max-w-lg mb-4"
        />
        <textarea
          //   type="text"
          placeholder="Post Description"
          name="description"
          className="input input-bordered w-full max-w-lg mb-4"
        />

        <select name="category" className="input input-bordered w-full max-w-lg mb-4">
          <option value="Category1">Device</option>
          <option value="Category2">House</option>
          <option value="Category3">Notes/Books</option>
        </select>

        <input
          type="date"
          name="date"
          className="input input-bordered w-full max-w-lg mb-4"
        />

        <input
          type="text"
          placeholder="Tags (comma separated)"
          name="tags"
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
