// src/components/Profile/Profile.tsx
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../firebase.init";
import axios from "axios";
import toast from "react-hot-toast";

interface UserProfile {
    _id: string;
    matriculation: number;
    firstName: string;
    lastName: string;
    dob: Date;
    email: string;
    password: string;
    role: string[];
    createdAt: Date;
    lastUpdatedAt: Date;
}

interface Lead {
    id: string;
    lId: number;
    userMatriculation: number;
    userEmail: string;
    content: string;
    leadTitle: string;
    imageUrls: string[];
    createdAt: Date;
    lastUpdatedAt: Date;
    comments: string[];
    likes: string[];
}

const Profile: React.FC = () => {
    const [user] = useAuthState(auth);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [leads, setLeads] = useState<Lead[]>([]);

    useEffect(() => {
        if (user?.email) {
            axios
                .get(`http://localhost:8080/user/email/${user.email}`, {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `${user.email} ${localStorage.getItem("accessToken")}`,
                    },
                })
                .then((response) => {
                    const data = response.data;
                    data.dob = new Date(data.dob);
                    data.createdAt = new Date(data.createdAt);
                    data.lastUpdatedAt = new Date(data.lastUpdatedAt);
                    setProfile(data);
                })
                .catch((error) => {
                    toast.error(error.message, { id: "profile-fetch-error" });
                });

            axios
                .get(`http://localhost:8080/leads/email/lead-by-userEmail/${user.email}`, {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `${user.email} ${localStorage.getItem("accessToken")}`,
                    },
                })
                .then((response) => {
                    const leadsData = response.data.map((lead: any) => ({
                        ...lead,
                        createdAt: new Date(lead.createdAt),
                        lastUpdatedAt: new Date(lead.lastUpdatedAt),
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

    return (
        <div className="profile-container max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Profile Information</h1>
            <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center">
                    <span className="font-semibold text-gray-700">Matriculation:</span>
                    <span className="ml-2 text-gray-900">{profile.matriculation}</span>
                </div>
                <div className="flex items-center">
                    <span className="font-semibold text-gray-700">First Name:</span>
                    <span className="ml-2 text-gray-900">{profile.firstName}</span>
                </div>
                <div className="flex items-center">
                    <span className="font-semibold text-gray-700">Last Name:</span>
                    <span className="ml-2 text-gray-900">{profile.lastName}</span>
                </div>
                <div className="flex items-center">
                    <span className="font-semibold text-gray-700">Date of Birth:</span>
                    <span className="ml-2 text-gray-900">{profile.dob.toDateString()}</span>
                </div>
                <div className="flex items-center">
                    <span className="font-semibold text-gray-700">Email:</span>
                    <span className="ml-2 text-gray-900">{profile.email}</span>
                </div>
                <div className="flex items-center">
                    <span className="font-semibold text-gray-700">Role:</span>
                    <span className="ml-2 text-gray-900">{profile.role.join(", ")}</span>
                </div>
                <div className="flex items-center">
                    <span className="font-semibold text-gray-700">Created At:</span>
                    <span className="ml-2 text-gray-900">{profile.createdAt.toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                    <span className="font-semibold text-gray-700">Last Updated At:</span>
                    <span className="ml-2 text-gray-900">{profile.lastUpdatedAt?.toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                    <span className="font-semibold text-gray-700">ID:</span>
                    <span className="ml-2 text-gray-900">{profile._id}</span>
                </div>
            </div>
            <h2 className="text-xl font-bold mt-6 mb-4">Leads Created by You</h2>
            <div className="grid grid-cols-1 gap-4">
                {leads.map((lead) => (
                    <div key={lead.id} className="p-4 bg-gray-100 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold">{lead.leadTitle}</h3>
                        <p className="text-gray-700">{lead.content}</p>
                        <p className="text-gray-500 text-sm">Created At: {lead.createdAt.toLocaleString()}</p>
                        <p className="text-gray-500 text-sm">Last Updated At: {lead.lastUpdatedAt.toLocaleString()}</p>
                        <p className="text-gray-500 text-sm">Comments: {lead.comments.length}</p>
                        <p className="text-gray-500 text-sm">Likes: {lead.likes.length}</p>
                        {lead.imageUrls.map((url, index) => (
                            <img key={index} src={url} alt={`Lead Image ${index + 1}`} className="mt-2" />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Profile;