import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { LeadType } from "./DashBoard";

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
  const { leadTitle, content, id, imageUrls } = lead;

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
        <a href="#!" data-mdb-ripple="true" data-mdb-ripple-color="light">
          <div className="w-80 h-72 overflow-hidden">
            <img className="w-full h-full object-cover" src={img} alt="" />
          </div>
        </a>
        <div className="p-6">
          <h5 className="text-2xl font-bold mb-3">{leadTitle ?? "No Title"}</h5>
          <p className="text-gray-700 text-base mb-4">
            {content ?? "No Description"}
          </p>
          <div className="flex justify-center align-middle">
            <button
              title="Edit?"
              onClick={() => handleEdit(id)}
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
    </div>
  );
};

export default Lead;
