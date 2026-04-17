import { Link } from "react-router-dom";
import "../pagescss/dashboard.css";

export default function Dashboard() {
  const user = {
    username: "musthak",
    email: "musthak@gmail.com",
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

      </div>
    </div>
  );
}