import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
import auth from "../../firebase.init";

interface Item {
  leadTitle: string;
  content: string;
  id: string;
}
interface Props {
  item: Item;
  index: number;
}

const ActivePost: React.FC<Props> = ({ item, index }) => {
  const [user] = useAuthState(auth);
  const { leadTitle, content, id } = item;

  const [userMatriculation, setUserMatriculation] = useState(0);
  const [isEditing, setIsEditing] = useState(false); // Toggle between view and edit mode
  const [editedLeadTitle, setEditedLeadTitle] = useState(leadTitle);
  const [editedContent, setEditedContent] = useState(content);

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
        toast.error(err.message, { id: "adding-error" });
      });
  }, [user?.email]);

  const handleDelete = (id: string) => {
    const proceed = window.confirm("Are you sure to delete?");
    if (proceed) {
      axios
        .delete(
          `https://unitrade-hawserver-production.up.railway.app/leads/delete/${userMatriculation}/${id}`
        )
        .then((response) => {
          toast.success("Successfully Deleted " + response.statusText, {
            id: "deleted",
          });
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

  const updateItemToDB = async (updatedItem: Item) => {
    try {
      const response = await axios.put(
        `https://unitrade-hawserver-production.up.railway.app/updateinfo/${id}`,
        updatedItem
      );
      if (response.status === 200) {
        toast.success("Lead Update Successful", { id: "Success" });
        setIsEditing(false); // Exit edit mode after successful update
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || error.toString();
      toast.error(errorMessage, { id: "update-error" });
    }
  };

  const handleUpdateLead = (id: string) => {
    const updatedItem = {
      id,
      leadTitle: editedLeadTitle, // updated title from state
      content: editedContent, // updated content from state
      userMatriculation,
    };
    updateItemToDB(updatedItem);
  };

  return (
    <>
      <tr className="hover:bg-gray-100">
        <th className="hidden md:table-cell">{index + 1}</th>
        <td>
          <p>{leadTitle}</p>
        </td>
        <td>
          <p>{content}</p>
        </td>
        <td>
          <button
            onClick={() => setIsEditing(true)} // Trigger the modal to open
            className="btn bg-blue-500 text-white hidden md:block"
          >
            Edit
          </button>
          <button
            title="Edit?"
            onClick={() => setIsEditing(true)} // Trigger the modal to open
            className="btn text-white bg-blue-500 md:hidden"
          >
            <FontAwesomeIcon icon={faPen} />
          </button>
        </td>
        <td>
          <button
            onClick={() => handleDelete(id)}
            className="btn bg-red-500 text-white hidden md:block"
          >
            Delete
          </button>
          <button
            onClick={() => handleDelete(id)}
            className="btn bg-red-500 text-white md:hidden"
            title="Delete?"
          >
            X
          </button>
        </td>
      </tr>

      {/* Modal Section */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-lg w-11/12 md:w-2/3 lg:w-1/2 h-5/6 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Post</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700">Post Title</label>
                <input
                  type="text"
                  className="border w-full p-2"
                  value={editedLeadTitle}
                  onChange={(e) => setEditedLeadTitle(e.target.value)} // Update title state
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  className="border w-full p-2"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)} // Update content state
                ></textarea>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={() => handleUpdateLead(id)} // Save changes
                >
                  Save
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setIsEditing(false)} // Close the modal
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ActivePost;
