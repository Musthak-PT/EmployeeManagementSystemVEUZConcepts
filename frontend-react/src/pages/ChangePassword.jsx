import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../pagescss/changepassword.css";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    old_password: "",
    new_password: "",
  });

  const submit = async () => {
    try {
      const res = await api.post("accounts/change-password/", data);

      if (res.data.success) {
        toast.success(res.data.message || "Password changed successfully");

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1200);

      } else {
        toast.error(res.data.message || "Failed");
      }

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="cp-container">
      <div className="cp-card">

        <Link to="/dashboard" className="dashboard-link">
          ⬅ Back to Dashboard
        </Link>

        <h2>Change Password</h2>

        <input
          type="password"
          placeholder="Old Password"
          onChange={(e) =>
            setData({ ...data, old_password: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="New Password"
          onChange={(e) =>
            setData({ ...data, new_password: e.target.value })
          }
        />

        <button onClick={submit}>
          Update Password
        </button>

      </div>
    </div>
  );
}