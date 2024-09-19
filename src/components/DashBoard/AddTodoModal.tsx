import React from "react";
import AddToDo from "./AddToDo";
import { LeadType } from "./DashBoard";

interface Props {
  prop?: string;
  showModal: boolean;
  handleClose: () => void;
  handleRefetch: () => void;
  lead?: LeadType;
}

const AddTodoModal: React.FC<Props> = ({
  showModal,
  handleClose,
  handleRefetch,
  lead,
}) => {
  return (
    <div>
      <input
        type="checkbox"
        id="add-to-do-modal"
        className="modal-toggle"
        checked={!!showModal}
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
          <h3 className="text-lg font-bold">
            {lead ? "Update Post" : "Do you want to post something?"}
          </h3>
          <AddToDo
            lead={lead}
            handleClose={handleClose}
            handleRefetch={handleRefetch}
          ></AddToDo>
        </div>
      </div>
    </div>
  );
};

export default AddTodoModal;
