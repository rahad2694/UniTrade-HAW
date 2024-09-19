import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
import auth from "../../firebase.init";
import AddTodoModal from "./AddTodoModal";
import { Link } from "react-router-dom";
import Lead from "./Lead";

export interface LeadType {
  userEmail: string;
  leadTitle: string;
  content: string;
  id: string;
  imageUrls: string[];
  createdAt?: string;
  lastUpdatedAt?: string;
  likes: string[];
}
interface Props {
  prop?: string;
}

const DashBoard: React.FC<Props> = () => {
  const [allLeads, setAllLeads] = useState([]);
  const [user] = useAuthState(auth);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState("");

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
  }, [user, refetch]);

  const handleRefetch = () => {
    setRefetch(!refetch);
  };

  function handleClose() {
    setShowAddModal(false);
    setSelectedLeadId("");
  }

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
    <div>
      <label
        onClick={() => setShowAddModal(true)}
        htmlFor="add-to-do-modal"
        className="btn modal-button my-5"
      >
        Add New Post
      </label>
      <AddTodoModal
        showModal={showAddModal}
        handleClose={handleClose}
        handleRefetch={handleRefetch}
        lead={allLeads.find((lead: LeadType) => lead.id === selectedLeadId)}
      ></AddTodoModal>

      {allLeads.length === 0 ? (
        <h1 className="text-red-500 font-bold my-2">
          No Post found in your Timeline
        </h1>
      ) : null}
      <div className="my-12 mx-12">
        <div className="p-4 grid lg:grid-cols-3 grid-cols-1 md:grid-cols-2 gap-8">
          {allLeads?.map((lead: LeadType) => (
            <Lead
              key={lead.id}
              lead={lead}
              setShowAddModal={() => setShowAddModal(true)}
              setSelectedLeadId={setSelectedLeadId}
              handleDelete={handleDelete}
            ></Lead>
          ))}
        </div>
        <Link className="btn mb-5 mt-10 text-white" to="/">
          Back to Home Page
        </Link>
      </div>
    </div>
  );
};

export default DashBoard;
