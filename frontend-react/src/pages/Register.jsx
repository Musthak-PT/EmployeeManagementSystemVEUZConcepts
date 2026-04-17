import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "../pagescss/login.css";

// ✅ Import toast
import { ToastContainer, toast } from "react-toastify";


export default function Register() {
  const nav = useNavigate();

  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const submit = async () => {
    try {
      const res = await api.post("accounts/register/", data);

      // ✅ Success response
      if (res.data.success) {
        toast.success(res.data.message || "Registered successfully!");

        // redirect after small delay
        setTimeout(() => {
          nav("/");
        }, 1500);
      }
    } catch (err) {
      // ✅ Handle error responses
      if (err.response && err.response.data) {
        const errors = err.response.data;

        let message = "";

        // Case 1: non_field_errors
        if (errors.non_field_errors) {
          message = errors.non_field_errors.join(" ");
        } 
        // Case 2: field errors (username, email etc)
        else {
          message = Object.values(errors).flat().join(" ");
        }

        toast.error(message);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  return (
    <div className="container">
      {/* ✅ Toast container */}
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="card">
        <h2>Register</h2>

        <input
          className="input"
          placeholder="Username"
          onChange={(e) =>
            setData({ ...data, username: e.target.value })
          }
        />

        <input
          className="input"
          placeholder="Email"
          onChange={(e) =>
            setData({ ...data, email: e.target.value })
          }
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setData({ ...data, password: e.target.value })
          }
        />

        <input
          className="input"
          type="password"
          placeholder="Confirm Password"
          onChange={(e) =>
            setData({
              ...data,
              confirm_password: e.target.value,
            })
          }
        />

        <button onClick={submit}>Register</button>
      </div>
    </div>
  );
}