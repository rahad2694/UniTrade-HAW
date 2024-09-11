import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
import auth from "../../firebase.init";

interface Item {
  leadTitle: string;
  content: string;
  id: string;
}
interface Props {
  item: Item;
  index: number;
}

const ActiveLeadTable: React.FC<Props> = ({ item, index }) => {
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

  return (
    <tr className="hover:bg-gray-100">
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

export default ActiveLeadTable;
