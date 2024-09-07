import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
import auth from "../../firebase.init";
// import ActiveToDoTable from "../Home/ActiveToDoTable";
import AddTodoModal from "./AddTodoModal";
import { Link } from "react-router-dom";
import Lead, { Item } from "./Lead";

interface Props {
  prop?: string;
}

const DashBoard: React.FC<Props> = () => {
  const [allLeads, setAllLeads] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    async function getItems() {
      const headers = {
        email: `${user?.email}`,
        user: "admin",
        password: 123456,
      };
      try {
        const response = await axios.get(
          `https://unitrade-hawserver-production.up.railway.app/leads/leads`,
          {
            headers: headers,
          }
        );
        setAllLeads(response.data);
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
  }, [user]);

  return (
    <div>
      <label htmlFor="add-to-do-modal" className="btn modal-button my-5">
        Add New Post
      </label>
      <AddTodoModal></AddTodoModal>

      {allLeads.length === 0 ? (
        <h1 className="text-red-500 font-bold my-2">
          No Post found in your Timeline
        </h1>
      ) : null}
      <div className="my-12 mx-12">
        <div className="p-4 grid lg:grid-cols-3 grid-cols-1 md:grid-cols-2 gap-8">
          {allLeads?.map((lead: Item) => (
            <Lead key={lead.id} item={lead}></Lead>
          ))}
        </div>
        <Link className="btn mb-5 mt-10 text-white" to="/">
          Back to Home Page
        </Link>
      </div>

      {/* <div className="my-3 mx-4">
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
      </div> */}
    </div>
  );
};

export default DashBoard;
