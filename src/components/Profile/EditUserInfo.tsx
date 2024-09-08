import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../firebase.init";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Define the UserProfile type
type Address = {
    street: string;
    houseNumber: number;
    postalCode: number;
    city: string;
    country: string;
};

type UserProfile = {
    firstName: string;
    lastName: string;
    dob: Date | null;
    email: string;
    matriculation: number;
    address: Address;
};

const EditUserInfo: React.FC = () => {
    const [user] = useAuthState(auth);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.email) {
            axios
                .get(`http://localhost:8080/user/${user.email}`, {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `${user.email} ${localStorage.getItem("accessToken")}`,
                    },
                })
                .then((response) => {
                    const data = response.data;
                    data.dob = data.dob ? new Date(data.dob) : null;
                    setProfile(data);
                })
                .catch((error: any) => {
                    toast.error(error.message, { id: "profile-fetch-error" });
                });
        }
    }, [user?.email]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (profile && user?.email) {
            try {
                await axios.put(`http://localhost:8080/user/update/${user.email}`, profile, {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `${user.email} ${localStorage.getItem("accessToken")}`,
                    },
                });
                toast.success("Profile updated successfully");
                navigate("/profile");
            } catch (error: any) {
                toast.error(error.message, { id: "profile-update-error" });
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name.startsWith("address.")) {
            const addressField = name.split(".")[1];
            setProfile((prevProfile: UserProfile | null) => (prevProfile ? { ...prevProfile, address: { ...prevProfile.address, [addressField]: value } } : null));
        } else {
            setProfile((prevProfile: UserProfile | null) => (prevProfile ? { ...prevProfile, [name]: value } : null));
        }
    };

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-8xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                    First Name
                </label>
                <input
                    type="text"
                    name="firstName"
                    value={profile.firstName ?? ""}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                    Last Name
                </label>
                <input
                    type="text"
                    name="lastName"
                    value={profile.lastName ?? ""}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dob">
                    Date of Birth
                </label>
                <input
                    type="date"
                    name="dob"
                    value={profile.dob ? profile.dob.toISOString().split("T")[0] : ""}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="matriculation">
                    Matriculation
                </label>
                <input
                    type="number"
                    name="matriculation"
                    value={profile.matriculation ?? ""}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address.street">
                    Street
                </label>
                <input
                    type="text"
                    name="address.street"
                    value={profile.address?.street ?? ""}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address.houseNumber">
                    House Number
                </label>
                <input
                    type="number"
                    name="address.houseNumber"
                    value={profile.address?.houseNumber ?? ""}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address.postalCode">
                    Postal Code
                </label>
                <input
                    type="number"
                    name="address.postalCode"
                    value={profile.address?.postalCode ?? ""}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address.city">
                    City
                </label>
                <input
                    type="text"
                    name="address.city"
                    value={profile.address?.city ?? ""}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address.country">
                    Country
                </label>
                <input
                    type="text"
                    name="address.country"
                    value={profile.address?.country ?? ""}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Update Profile
            </button>
        </form>
    );
};

export default EditUserInfo;