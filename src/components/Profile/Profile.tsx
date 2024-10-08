import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../firebase.init";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { LeadType } from "../DashBoard/DashBoard";
import Lead from "../DashBoard/Lead";
import AddTodoModal from "../DashBoard/AddTodoModal";
import Spinners from "../Spinners/Spinners";

interface Address {
  street: string;
  houseNumber: number;
  postalCode: number;
  city: string;
  country: string;
}

export interface UserProfile {
  _id: string;
  matriculation?: number | null;
  firstName?: string | null;
  lastName?: string | null;
  dob?: Date | null;
  email: string;
  password?: string | null;
  role?: string[] | null;
  createdAt?: Date | null;
  lastUpdatedAt?: Date | null;
  address?: Address | null;
}

const Profile: React.FC = () => {
  const [user] = useAuthState(auth);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [leads, setLeads] = useState<LeadType[]>([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState("");

  const getIfUserExists = async (userEmail: string) => {
    if (userEmail) {
      const url = `https://unitrade-hawserver-production.up.railway.app/user/${userEmail}`;
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          authorization: `${userEmail} ${localStorage.getItem("accessToken")}`,
        },
      });
      setProfile(response.data);
      return response.data;
    }
  };

  useEffect(() => {
    if (user?.email) {
      getIfUserExists(user.email);
      getItems();
    }
    async function getItems() {
      const headers = {
        email: `${user?.email}`,
        user: "admin",
        password: 123456,
      };
      try {
        const response = await axios.get(
          `https://unitrade-hawserver-production.up.railway.app/leads/lead-by-userEmail/${user?.email}`,
          {
            headers: headers,
          }
        );
        setLeads(response.data);
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
  }, [user, refetch]);

  const handleRefetch = () => {
    setRefetch(!refetch);
  };

  // Added handleDelete function
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

  if (!profile) {
    return <Spinners></Spinners>;
  }

  const fullName =
    `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim() || "N/A";
  const addressString = profile.address
    ? `${profile.address.street}, ${profile.address.houseNumber}, ${profile.address.postalCode}, ${profile.address.city}, ${profile.address.country}`
    : "N/A";

  function handleClose() {
    setShowAddModal(false);
    setSelectedLeadId("");
  }

  return (
    <div className="mt-6 bg-white rounded-lg shadow-md">
      <AddTodoModal
        showModal={showAddModal}
        handleClose={handleClose}
        handleRefetch={handleRefetch}
        lead={leads?.find((lead: LeadType) => lead.id === selectedLeadId)}
      ></AddTodoModal>

      <div className="overflow-x-auto">
        <h1 className="text-md lg:text-lg font-bold mb-2 md:mb-8">
          {fullName}'s Profile
        </h1>
        <div>
          <table className="table text-center">
            <tbody>
              <tr className="hover text-xs md:text-sm">
                <td>Name</td>
                <td>{fullName}</td>
              </tr>
              <tr className="hover text-xs md:text-sm">
                <td>Matriculation</td>
                <td>{profile.matriculation ?? "N/A"}</td>
              </tr>
              <tr className="hover text-xs md:text-sm">
                <td>Date of Birth</td>
                <td>{profile.dob ? profile.dob.toDateString() : "N/A"}</td>
              </tr>
              <tr className="hover text-xs md:text-sm">
                <td>Email</td>
                <td>{profile.email}</td>
              </tr>
              <tr className="hover text-xs md:text-sm">
                <td>Role</td>
                <td>{profile.role ? profile.role.join(", ") : "N/A"}</td>
              </tr>
              <tr className="hover text-xs md:text-sm">
                <td>Created At</td>
                <td>
                  {profile.createdAt
                    ? profile.createdAt.toLocaleString()
                    : "N/A"}
                </td>
              </tr>
              <tr className="hover text-xs md:text-sm">
                <td>Last Updated At</td>
                <td>
                  {profile.lastUpdatedAt
                    ? profile.lastUpdatedAt.toLocaleString()
                    : "N/A"}
                </td>
              </tr>

              <tr className="hover text-xs md:text-sm">
                <td>Address</td>
                <td>{addressString}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="edit p-6 mt-4 btn-sm">
        <Link to="/edit-user-info" className="btn text-white bg-blue-500">
          Edit Profile
        </Link>
      </div>

      <div className="my-12 mx-12">
        <h2 className="text-xl font-bold mb-4">Leads Created by You</h2>
        <div className="p-4 grid lg:grid-cols-3 grid-cols-1 md:grid-cols-2 gap-8">
          {leads?.map((lead: LeadType) => (
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

export default Profile;
