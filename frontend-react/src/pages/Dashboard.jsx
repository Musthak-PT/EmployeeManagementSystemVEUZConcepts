import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import "../pagescss/dashboard.css";

export default function Dashboard() {

  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "Nil",
    email: "Nil",
  });
  // ✅ FETCH PROFILE
  const loadProfile = async () => {
    try {
      const res = await api.get("accounts/profile/");

      if (res.data.success) {
        setUser({
          username: res.data.data.username || "Nil",
          email: res.data.data.email || "Nil",
        });
      }
    } catch (err) {
      console.log("Profile load failed", err);
      setUser({
        username: "Nil",
        email: "Nil",
      });
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // Logout 
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    navigate("/", { replace: true }); // prevents back button
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">

        {/* HEADER */}
        <div className="dashboard-header">

          {/* LEFT PROFILE */}
          <div className="profile-box">
            <div className="avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>

            <div className="profile-info">
              <h4>{user.username}</h4>
              <p>{user.email}</p>
            </div>
          </div>

          {/* RIGHT TEXT */}
          <div className="header-text">
            <h1 className="title">Dashboard</h1>
            <p className="subtitle">
              Welcome back 👋 Manage everything below
            </p>

          </div>

        </div>

        {/* GRID */}
        <div className="gridss">
          <Link to="/forms" className="dash-box">
            📝 Create Form
          </Link>

          <Link to="/employee-create" className="dash-box">
            👤 Create Employee
          </Link>

          <Link to="/employees" className="dash-box">
            📋 Employee List
          </Link>
        </div>


        <div className="logout-wrapper">
          

        {/* Change password */}
          <Link to="/change-password" className="logout-link">
              Change Password
          </Link>

          <button onClick={handleLogout} className="logout-link">
            Logout
          </button>
        
        </div>

      </div>
    </div>
  );
}