import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import "../pagescss/employeelist.css";

export default function EmployeeList() {

  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);

  const navigate = useNavigate();

  // =========================
  // LOAD EMPLOYEES
  // =========================
  const load = async (pageNumber = 1) => {
    try {
      const res = await api.get(
        `employees/?page=${pageNumber}&search=${search}`
      );

      // ✅ FIX: correct path is results.data
      setList(res.data.results?.data || []);
      setNext(res.data.next);
      setPrevious(res.data.previous);
      setPage(pageNumber);

    } catch (err) {
      console.log(err);
      toast.error("Failed to load employees");
    }
  };

  useEffect(() => {
    load(1);
  }, []);

  // =========================
  // DELETE EMPLOYEE
  // =========================
  const remove = async (id) => {
    try {
      await api.delete(`employees/${id}/delete/`);
      toast.success("Deleted successfully");
      load(page);
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // =========================
  // SEARCH
  // =========================
  const handleSearch = (value) => {
    setSearch(value);
    load(1);
  };

  return (
    <div className="emp-list-container">

      {/* BACK */}
      <Link to="/dashboard" className="dashboard-link-employee">
        ⬅ Back to Dashboard
      </Link>

      <h2>Employees</h2>

      {/* SEARCH */}
      <div className="search-container">
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
          onChange={(e) => handleSearch(e.target.value)}
          className="search-box"
        />
      </div>

      {/* EMPTY STATE */}
      {list.length === 0 ? (
        <div className="empty-state">
          <h3>No Employees Found</h3>
          <p>Create or change search keyword</p>
        </div>
      ) : (
        <>
          {/* GRID */}
          <div className="grid">
            {list.map((item) => (
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
                      navigate(`/employees/edit/${item.id}?page=${page}`)
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

          {/* PAGINATION */}
          <div className="pagination">

            <button
              disabled={!previous}
              onClick={() => load(page - 1)}
            >
              ⬅ Prev
            </button>

            <span>Page {page}</span>

            <button
              disabled={!next}
              onClick={() => load(page + 1)}
            >
              Next ➡
            </button>

          </div>
        </>
      )}
    </div>
  );
}