import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../pagescss/login.css"; // Styles of login page

export default function Login() {
  const nav = useNavigate();

  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const submit = async () => {
    try {
      const res = await api.post("accounts/login/", data);

      // SUCCESS CASE
      if (res.data.success) {
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);

        toast.success(res.data.message || "Login successful");

        setTimeout(() => {
          nav("/dashboard");
        }, 1000);
      } else {
        // backend returned success: false
        toast.error(res.data.message || "Login failed");
      }
    } catch (err) {
      // NETWORK / SERVER ERROR
      toast.error(
        err.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Login</h2>

        <input
          className="input"
          placeholder="Username"
          onChange={(e) =>
            setData({ ...data, username: e.target.value })
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

        <button onClick={submit}>Login</button>

        <p class="no_account">
          No account? <Link to="/register" className="register-link">Register</Link>
        </p>
      </div>
    </div>
  );
}