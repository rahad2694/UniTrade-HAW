import React from "react";
import AddLead from "./AddLead";

interface Props {
  prop?: string;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleRefetch: () => void;
}

const AddLeadModal: React.FC<Props> = ({
  showModal,
  setShowModal,
  handleRefetch,
}) => {
  function handleClose() {
    setShowModal(false);
  }
  return (
    <div>
      <input
        type="checkbox"
        id="add-to-do-modal"
        className="modal-toggle"
        checked={showModal}
      />
      <div className="modal">
        <div className="modal-box relative">
          <label
            onClick={handleClose}
            htmlFor="add-to-do-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold">Do you want to post something?</h3>
          <AddLead
            handleClose={handleClose}
            handleRefetch={handleRefetch}
          ></AddLead>
        </div>
      </div>
    </div>
  );
};

export default AddLeadModal;
