import React from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../firebase.init";
import { signOut } from "firebase/auth";

interface Props {
  prop?: string;
}

const Navbar: React.FC<Props> = () => {
  const [user] = useAuthState(auth);
  return (
    <div className="navbar bg-base-100 sticky top-0 z-50">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl ml-3">
          UniTrade
        </Link>
      </div>
      <div className="flex-none">
        <Link
          className="mx-2 p-3 rounded-lg hover:bg-base-300 transition delay-100 duration-200 ease-in-out"
          to="/"
        >
          Home
        </Link>
        {user?.uid ? (
          <Link
            className="mx-2 p-3 rounded-lg hover:bg-base-300 transition delay-100 duration-200 ease-in-out"
            to="/dashboard"
          >
            Dashboard
          </Link>
        ) : null}
        {user?.uid ? (
          <div className="dropdown dropdown-end mx-6">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt=""
                  src={
                    user?.photoURL ??
                    `https://www.unoreads.com/user_profile_pic/demo-user.png`
                  }
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <button className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    signOut(auth);
                    toast.success("Successfully Logged Out", { id: "logout" });
                  }}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link className="mx-2 btn btn-ghost" to="/login">
            Log in
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
