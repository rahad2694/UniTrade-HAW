import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";

interface Item {
  leadTitle: string;
  content: string;
  userMatriculation: number;
  id: string;
}
interface Props {
  item: Item;
  index: number;
}

const ActiveToDoTable: React.FC<Props> = ({ item, index }) => {
  const { leadTitle, content, userMatriculation, id } = item;

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
      //   const id = id;
      const response = await axios.put(
        `https://simple-to-do-app-server.herokuapp.com/updateinfo/${id}`,
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

  return (
    <tr>
      <th className="hidden md:table-cell">{index + 1}</th>
      <td>
        <p>{leadTitle}</p>
      </td>
      <td>
        <p>{content}</p>
      </td>
      <td>
        <button
          //   disabled={true}
          onClick={() => handleUpdateLead(id)}
          className="btn bg-blue-500 text-white hidden md:block"
        >
          Edit
        </button>
        <button
          //   disabled={true}
          title="Edit?"
          onClick={() => handleUpdateLead(id)}
          className="btn text-white bg-blue-500 md:hidden"
        >
          <FontAwesomeIcon icon={faPen} />
        </button>
      </td>
      <td>
        <button
          onClick={() => handleDelete(id)}
          className="btn bg-red-500 text-white hidden md:block"
        >
          Delete
        </button>
        <button
          onClick={() => handleDelete(id)}
          className="btn bg-red-500 text-white md:hidden"
          title="Delete?"
        >
          X
        </button>
      </td>
    </tr>
  );
};

export default ActiveToDoTable;
