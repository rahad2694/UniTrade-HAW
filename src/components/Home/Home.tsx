import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import auth from "../../firebase.init";

interface Props {
  prop?: string;
}

const Home: React.FC<Props> = () => {
  const [user] = useAuthState(auth);
  return (
    <div>
      <h1 className="text-purple-500 text-2xl font-bold my-20">
        Welcome to your UniTrade
      </h1>
      {user?.uid ? (
        <Link className="btn bg-green-500 text-white" to="/dashboard">
          Get Started
        </Link>
      ) : (
        <Link className="btn bg-red-500 text-white" to="/login">
          Login to Start
        </Link>
      )}
    </div>
  );
};

export default Home;
