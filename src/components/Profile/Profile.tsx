import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../firebase.init";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

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

interface Lead {
  id: string;
  lId?: number | null;
  userMatriculation?: number | null;
  userEmail: string;
  content?: string | null;
  leadTitle?: string | null;
  imageUrls?: string[] | null;
  createdAt?: Date | null;
  lastUpdatedAt?: Date | null;
  comments?: string[] | null;
  likes?: string[] | null;
}

const Profile: React.FC = () => {
  const [user] = useAuthState(auth);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    if (user?.email) {
      axios
        .get(
          `https://unitrade-hawserver-production.up.railway.app/user/${user.email}`,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `${user.email} ${localStorage.getItem(
                "accessToken"
              )}`,
            },
          }
        )
        .then((response) => {
          const data = response.data;
          data.dob = data.dob ? new Date(data.dob) : null;
          data.createdAt = data.createdAt ? new Date(data.createdAt) : null;
          data.lastUpdatedAt = data.lastUpdatedAt
            ? new Date(data.lastUpdatedAt)
            : null;
          setProfile(data);
        })
        .catch((error) => {
          toast.error(error.message, { id: "profile-fetch-error" });
        });

      axios
        .get(
          `https://unitrade-hawserver-production.up.railway.app/leads/lead-by-userEmail/${user.email}`,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `${user.email} ${localStorage.getItem(
                "accessToken"
              )}`,
            },
          }
        )
        .then((response) => {
          const leadsData = response.data.map((lead: Lead) => ({
            ...lead,
            createdAt: lead.createdAt ? new Date(lead.createdAt) : null,
            lastUpdatedAt: lead.lastUpdatedAt
              ? new Date(lead.lastUpdatedAt)
              : null,
          }));
          setLeads(leadsData);
        })
        .catch((error) => {
          toast.error(error.message, { id: "leads-fetch-error" });
        });
    }
  }, [user?.email]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  const fullName =
    `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim() || "N/A";
  const addressString = profile.address
    ? `${profile.address.street}, ${profile.address.houseNumber}, ${profile.address.postalCode}, ${profile.address.city}, ${profile.address.country}`
    : "N/A";

  return (
    <div className="max-w-8xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="profile-container mb-8 p-6 bg-gray-100 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Profile Information</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Name
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {fullName}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Matriculation
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {profile.matriculation ?? "N/A"}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Date of Birth
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {profile.dob ? profile.dob.toDateString() : "N/A"}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Email
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {profile.email}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Role
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {profile.role ? profile.role.join(", ") : "N/A"}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Created At
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {profile.createdAt
                    ? profile.createdAt.toLocaleString()
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Last Updated At
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {profile.lastUpdatedAt
                    ? profile.lastUpdatedAt.toLocaleString()
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ID
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {profile._id}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Address
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {addressString}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Link to="/edit-user-info" className="text-blue-500 hover:underline">
          Edit Profile
        </Link>
      </div>

      {/* Leads Table Card */}
      <div className="profile-container mb-8 p-6 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Leads Created by You</h2>
        <div className="overflow-x-auto">
          {leads.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comments
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Likes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {lead.leadTitle ?? "Untitled"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.content ?? "No content available"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.createdAt ? lead.createdAt.toLocaleString() : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.lastUpdatedAt
                        ? lead.lastUpdatedAt.toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.comments ? lead.comments.length : 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.likes ? lead.likes.length : 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No leads available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
