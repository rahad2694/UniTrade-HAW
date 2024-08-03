import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";

interface Item {
  taskName: string;
  taskDescription: string;
  email: string;
  _id: string;
  completed: boolean;
}
interface Props {
  item: Item;
  index: number;
}

const ActiveToDoTable: React.FC<Props> = ({ item, index }) => {
  const { taskName, taskDescription, email, _id, completed } = item;

  const handleDelete = (id: string) => {
    const proceed = window.confirm("Are you sure to delete?");
    if (proceed) {
      axios
        .delete(`https://simple-to-do-app-server.herokuapp.com/ietm/${id}`)
        .then((response) => {
          console.log(response);
          toast.success("Successfully Deleted", { id: "deleted" });
        })
        .catch((error) => {
          toast.error(error.message, { id: "delete-error" });
        });
    } else {
      toast.success("Attempt Terminated", { id: "delete-cancel" });
    }
  };
  const updateItemToDB = async (updatedItem: Item) => {
    try {
      const id = _id;
      const response = await axios.put(
        `https://simple-to-do-app-server.herokuapp.com/updateinfo/${id}`,
        updatedItem
      );
      if (response.status === 200) {
        toast.success("Marked As Completed", { id: "Success" });
      }
    } catch (error) {
      // @ts-expect-error need to adjust
      error && toast.error(error.message, { id: "update-error" });
    }
  };
  const handleStrikeThrough = (id: string) => {
    const _id = id;
    const updatedItem = {
      _id,
      taskName,
      taskDescription,
      email,
      completed: true,
    };
    updateItemToDB(updatedItem);
  };

  return (
    <tr>
      <th className="hidden md:table-cell">{index + 1}</th>
      <td>{completed ? <s>{taskName}</s> : <p>{taskName}</p>}</td>
      <td>{completed ? <s>{taskDescription}</s> : <p>{taskDescription}</p>}</td>
      <td>
        <button
          disabled={completed}
          onClick={() => handleStrikeThrough(_id)}
          className="btn text-white hidden md:block"
        >
          Mark Complete
        </button>
        <button
          disabled={completed}
          title="Mark Complete?"
          onClick={() => handleStrikeThrough(_id)}
          className="btn text-white md:hidden"
        >
          <FontAwesomeIcon icon={faCheck} />
        </button>
      </td>
      <td>
        <button
          onClick={() => handleDelete(_id)}
          className="btn bg-blue-500 text-white hidden md:block"
        >
          Delete
        </button>
        <button
          onClick={() => handleDelete(_id)}
          className="btn bg-blue-500 text-white md:hidden"
          title="Delete?"
        >
          X
        </button>
      </td>
    </tr>
  );
};

export default ActiveToDoTable;
