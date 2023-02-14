import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { useAuth } from "../context/AuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
export default function HomeLayout () {
  const { currentUser } = useAuth();
  return (currentUser
    ? (<>
    <NavBar />
    <section className="row">
      <Outlet />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </section>
    </>)
    : <Navigate to="/login" replace />
  );
}
