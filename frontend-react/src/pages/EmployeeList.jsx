import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import "../pagescss/employeelist.css";

export default function EmployeeList() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    try {
      const res = await api.get("employees/");
      setList(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load employees");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    try {
      await api.delete(`employees/${id}/delete/`);
      toast.success("Deleted successfully");
      load();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // ===============================
  // 🔍 SEARCH FILTER LOGIC
  // ===============================
  const filteredList = list.filter((item) => {
    const keyword = search.toLowerCase();

    // search in form title
    if (item.form_title?.toLowerCase().includes(keyword)) {
      return true;
    }

    // search in dynamic values
    return item.values?.some((v) =>
      v.label?.toLowerCase().includes(keyword) ||
      v.value?.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="emp-list-container">

      <Link to="/dashboard" className="dashboard-link-employee">
          ⬅ Back to Dashboard
      </Link>

      <h2>Employees</h2>

      {/* ===============================
          🔍 SEARCH INPUT (NEW)
      =============================== */}
      <div className="search-container">
        {/* <span className="search-icon-left">🔍</span> */}
        <svg 
          className="search-icon-left" 
          viewBox="0 0 24 24" 
          width="20" 
          height="20" 
          fill="none" 
          stroke="#999" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          placeholder="Search by title, label and value..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-box"
        />
      </div>

      {filteredList.length === 0 ? (
        <div className="empty-state">
          <h3>No Employees Found</h3>
          <p>Try changing search keywords</p>
        </div>
      ) : (
        <div className="grid">
          {filteredList.map((item) => (
            <div key={item.id} className="card">
              <h3>{item.form_title}</h3>

              <div className="values">
                {item.values.map((v, i) => (
                  <p key={i}>
                    <span>{v.label}:</span> {v.value}
                  </p>
                ))}
              </div>

              <div className="actions">
                <button
                  className="edit"
                  onClick={() =>
                    navigate(`/employees/edit/${item.id}`)
                  }
                >
                  Edit
                </button>

                <button
                  className="delete"
                  onClick={() => remove(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}