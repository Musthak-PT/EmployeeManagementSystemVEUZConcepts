import { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";
import "../pagescss/formbuilder.css";

export default function EmployeeEdit() {

  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ⭐ keep pagination page
  const page = searchParams.get("page") || 1;

  const [formId, setFormId] = useState(null);
  const [values, setValues] = useState([]);
  const [fields, setFields] = useState([]);

  // =========================
  // LOAD EMPLOYEE + FORM
  // =========================
  useEffect(() => {
    const load = async () => {
      try {

        // ⚠️ better API usage (you already have list, but safer is direct API if possible)
        const res = await api.get("employees/");

        const emp = res.data.results?.data?.find(
          (e) => e.id == id
        );

        if (!emp) {
          toast.error("Employee not found");
          return;
        }

        setFormId(emp.form);
        setValues(emp.values || []);

        // load form structure
        const formRes = await api.get("forms/");

        const form = formRes.data.data?.find(
          (f) => f.id == emp.form
        );

        setFields(form?.fields || []);

      } catch (err) {
        console.log(err);
        toast.error("Failed to load employee");
      }
    };

    load();
  }, [id]);

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (label, value) => {
    setValues((prev) => {
      const filtered = prev.filter((v) => v.label !== label);
      return [...filtered, { label, value }];
    });
  };

  // =========================
  // UPDATE EMPLOYEE
  // =========================
  const update = async () => {
    try {

      const res = await api.put(
        `employees/${id}/update/`,
        {
          form: formId,
          values,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);

        // ⭐ go back to same page
        navigate(`/employees?page=${page}`);
      } else {
        toast.error(res.data.message || "Update failed");
      }

    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">

        {/* BACK */}
        <Link to={`/employees?page=${page}`} className="dashboard-link">
          ⬅ Back to Employees
        </Link>

        <h2>Edit Employee</h2>

        {/* FORM FIELDS */}
        {fields.map((field, index) => {

          const existing = values.find(
            (v) => v.label === field.label
          );

          return (
            <div key={index} className="field-row">

              <label>{field.label}</label>

              {/* ⭐ FIX: controlled input instead of defaultValue */}
              <input
                type={field.field_type}
                placeholder={field.placeholder}
                value={existing?.value || ""}
                onChange={(e) =>
                  handleChange(field.label, e.target.value)
                }
              />

            </div>
          );
        })}

        {/* BUTTON */}
        <div className="button-row">
          <button className="save-btn" onClick={update}>
            Update Employee
          </button>
        </div>

      </div>
    </div>
  );
}