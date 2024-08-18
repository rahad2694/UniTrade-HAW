import React from "react";
import AddToDo from "./AddToDo";

interface Props {
  prop?: string;
}

const AddTodoModal: React.FC<Props> = () => {
  return (
    <div>
      <input type="checkbox" id="add-to-do-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="add-to-do-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold">Do you want to post something?</h3>
          <AddToDo></AddToDo>
        </div>
      </div>
    </div>
  );
};

export default AddTodoModal;
