import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
import auth from "../../firebase.init";
import ActiveToDoTable from "../Home/ActiveToDoTable";
import AddTodoModal from "./AddTodoModal";

interface Props {
  prop?: string;
}

const DashBoard: React.FC<Props> = () => {
  const [allItems, setAllItems] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    async function getItems() {
      const headers = {
        email: `${user?.email}`,
      };
      try {
        const response = await axios.get(
          `https://unitrade-hawserver-production.up.railway.app/leads/leads`,
          {
            headers: headers,
          }
        );
        setAllItems(response.data);
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          // @ts-expect-error needed to render the error message in toast
          toast.error(`Error: ${axiosError.response.data?.message}`, {
            id: "error-message",
          });
        } else if (axiosError.request) {
          toast.error("No response received from the server", {
            id: "error-message",
          });
        } else {
          toast.error(axiosError.message, { id: "error-message" });
        }
      }
    }
    getItems();
  }, [allItems, user]);

  return (
    <div>
      <h1 className="text-purple-500 text-2xl font-bold my-2">Your Timeline</h1>
      <label htmlFor="add-to-do-modal" className="btn modal-button my-5">
        Add New Post
      </label>
      <AddTodoModal></AddTodoModal>
      <div className="my-3 mx-4">
        <div>
          {allItems.length === 0 ? (
            <h1 className="text-red-500 font-bold my-3">
              No Post added by you yet
            </h1>
          ) : (
            <h1 className="text-green-500 font-bold my-3">Your Posts</h1>
          )}
          <div className="overflow-x-auto">
            <table className="table mx-auto w-1/4 md:w-2/4 lg:w-11/12 text-center">
              <thead>
                <tr>
                  <th className="hidden md:table-cell"></th>
                  <th>Post Title</th>
                  <th>Post Description</th>
                  <th>Action</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {allItems.map((item, index) => (
                  <ActiveToDoTable
                    index={index}
                    // @ts-expect-error needed to ADJUST
                    key={item.id}
                    item={item}
                  ></ActiveToDoTable>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
