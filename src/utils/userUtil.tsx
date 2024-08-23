import axios from "axios";

export const getMatriculationByEmail = async (
  email: string
): Promise<number> => {
  const headers = {
    email: `${email}`,
  };
  try {
    const response = await axios.get(`http://localhost:8080/user/${email}`, {
      headers: headers,
    });
    return response.data;
  } catch (error) {
    return 0;
  }
};
