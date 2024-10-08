import { Toaster } from "react-hot-toast";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";
import NotFound from "./components/NotFound/NotFound";
import RequireAuth from "./components/Login/RequireAuth";
import DashBoard from "./components/DashBoard/DashBoard";
import Home from "./components/Home/Home";
import Profile from "./components/Profile/Profile";
import EditUserInfo from "./components/Profile/EditUserInfo";
import PostDetails from "./components/DashBoard/PostDetails";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/signup" element={<SignUp></SignUp>}></Route>
        <Route path="/profile" element={<Profile></Profile>}></Route>
        <Route path="/post/:id" element={<PostDetails />} />
        <Route path="/edit-user-info" element={<EditUserInfo />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashBoard></DashBoard>
            </RequireAuth>
          }
        ></Route>

        <Route path="*" element={<NotFound></NotFound>}></Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
