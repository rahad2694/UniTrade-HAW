import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../firebase.init";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom"; // <-- Import Link from react-router-dom

export interface Item {
  leadTitle: string;
  content: string;
  id: string;
  imageUrls: string[];
}
interface Props {
  item: Item;
  handleRefetch: () => void;
}

const Lead: React.FC<Props> = ({ item, handleRefetch }) => {
  const [user] = useAuthState(auth);
  const { leadTitle, content, id, imageUrls } = item;

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

  const updateItemToDB = async (updatedItem: Item) => {
    try {
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
    const updatedItem = {
      id,
      leadTitle,
      content,
      userMatriculation,
      imageUrls,
    };
    updateItemToDB(updatedItem);
  };

  const noImageSrc = "https://i.ibb.co/ZMYzS6R/no-image.jpg";
  const img =
    imageUrls?.length && imageUrls[0] !== "" ? imageUrls[0] : noImageSrc;

  return (
    <div className="flex justify-center ">
      <div className="rounded-lg shadow-lg bg-white max-w-sm lg:hover:scale-110 transition ease-in-out delay-300 hover:shadow-xl">
        {/* Link to the Post Details page */}
        <Link to={`/post/${id}`} data-mdb-ripple="true" data-mdb-ripple-color="light">
          <img className="rounded-t-lg" src={img} alt={leadTitle} />
          <div className="p-6">
            <h5 className="text-2xl font-bold mb-3">{leadTitle ?? "No Title"}</h5>
            <p className="text-gray-700 text-base mb-4">
              {content ?? "No Description"}
            </p>
          </div>
        </Link>
        <div className="p-6 flex justify-center align-middle">
          <button
            title="Edit?"
            onClick={() => handleUpdateLead(id)}
            className="btn text-white bg-blue-500"
          >
            <FontAwesomeIcon icon={faPen} />
          </button>
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
  );
};

export default Lead;
