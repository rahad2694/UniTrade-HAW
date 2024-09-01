import axios from "axios";

export const getMatriculationByEmail = async (
  email: string
): Promise<number> => {
  const headers = {
    email: `${email}`,
  };
  try {
    const response = await axios.get(
      `https://unitrade-hawserver-production.up.railway.app/user/${email}`,
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    return 0;
  }
};
