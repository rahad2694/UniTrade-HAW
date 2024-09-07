// import React from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
// import { Link } from "react-router-dom";
import auth from "../../firebase.init";
// import UseGetUser from '../../hooks/UseGetUser';
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
// import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
// import auth from "../../firebase.init";

export interface Item {
  leadTitle: string;
  content: string;
  id: string;
}
interface Props {
  item: Item;
}

const Lead: React.FC<Props> = ({ item }) => {
  const [user] = useAuthState(auth);
  const { leadTitle, content, id } = item;

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
      //   const id = id;
      const response = await axios.put(
        `https://unitrade-hawserver-production.up.railway.app/updateinfo/${id}`,
        updatedItem
      );
      if (response.status === 200) {
        toast.success("Lead Update Successful", { id: "Success" });
      }
    } catch (error) {
      // @ts-expect-error need to adjust
      error && toast.error(error.message, { id: "update-error" });
    }
  };
  const handleUpdateLead = (id: string) => {
    // const id = id;
    const updatedItem = {
      id,
      leadTitle,
      content,
      userMatriculation,
    };
    updateItemToDB(updatedItem);
  };

  const noImageSrc = "https://i.ibb.co/ZMYzS6R/no-image.jpg";
  const img = noImageSrc;
  return (
    <div className="flex justify-center ">
      <div className="rounded-lg shadow-lg bg-white max-w-sm lg:hover:scale-110 transition ease-in-out delay-300 hover:shadow-xl">
        <a href="#!" data-mdb-ripple="true" data-mdb-ripple-color="light">
          <img className="rounded-t-lg" src={img} alt="" />
        </a>
        <div className="p-6">
          <h5 className="text-2xl font-bold mb-3">{leadTitle ?? "No Title"}</h5>
          <p className="text-gray-700 text-base mb-4">
            {content ?? "No Description"}
          </p>
          <div className="flex justify-center align-middle">
            {/* <button
              //   disabled={true}
              onClick={() => handleUpdateLead(id)}
              className="btn bg-blue-500 text-white hidden md:block"
            >
              Edit
            </button> */}
            <button
              //   disabled={true}
              title="Edit?"
              onClick={() => handleUpdateLead(id)}
              className="btn text-white bg-blue-500"
            >
              <FontAwesomeIcon icon={faPen} />
            </button>

            {/* <button
              onClick={() => handleDelete(id)}
              className="btn bg-red-500 text-white hidden md:block ml-2 py-1 px-2"
            >
              Delete
            </button> */}
            <button
              onClick={() => handleDelete(id)}
              className="btn bg-red-500 text-white ml-2"
              title="Delete?"
            >
              <FontAwesomeIcon className="text-xl" icon={faXmark} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lead;
