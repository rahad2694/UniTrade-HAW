import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { LeadType } from "./DashBoard";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../firebase.init";
import { Link } from "react-router-dom";

interface Props {
  lead: LeadType;
  setShowAddModal: () => void;
  setSelectedLeadId: (id: string) => void;
  handleDelete: (id: string) => void;
}

const Lead: React.FC<Props> = ({
  lead,
  setShowAddModal,
  setSelectedLeadId,
  handleDelete,
}) => {
  const [user] = useAuthState(auth);
  const { leadTitle, content, id, imageUrls, userEmail } = lead;

  const handleEdit = (id: string) => {
    setShowAddModal();
    setSelectedLeadId(id);
  };

  const noImageSrc = "https://i.ibb.co/ZMYzS6R/no-image.jpg";
  const img =
    imageUrls?.length && imageUrls[0] != "" ? imageUrls[0] : noImageSrc;
  return (
    <div className="flex justify-center ">
      <div className="rounded-lg shadow-lg bg-white max-w-sm lg:hover:scale-110 transition ease-in-out delay-300 hover:shadow-xl">
        <Link
          to={`/post/${id}`}
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
        >
          <div className="w-80 h-72 overflow-hidden mx-auto">
            <img className="w-full h-full object-cover" src={img} alt="" />
          </div>
        </Link>
        <div className="p-6">
          <h5 className="text-2xl font-bold mb-3">
            {leadTitle?.slice(0, 30) ?? "No Title"}
            {leadTitle?.length >= 30 ? "...." : ""}
          </h5>
          <p className="text-gray-700 text-base mb-4">
            {content?.slice(0, 82) ?? "No Description"}
            {content?.length >= 82 ? "...." : ""}
          </p>
          <div className="flex justify-center align-middle">
            <button
              title="Edit?"
              onClick={() => handleEdit(id)}
              className="btn text-white bg-blue-500"
              disabled={user?.email !== userEmail}
            >
              <FontAwesomeIcon icon={faPen} />
            </button>
            <button
              onClick={() => handleDelete(id)}
              className="btn bg-red-500 text-white ml-2"
              title="Delete?"
              disabled={user?.email !== userEmail}
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
