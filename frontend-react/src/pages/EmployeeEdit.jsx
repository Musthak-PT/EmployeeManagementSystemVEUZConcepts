import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";
import "../pagescss/formbuilder.css";

export default function EmployeeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formId, setFormId] = useState(null);
  const [values, setValues] = useState([]);
  const [fields, setFields] = useState([]);

  // LOAD EMPLOYEE
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("employees/");
        const emp = res.data.data.find((e) => e.id == id);

        if (emp) {
          setFormId(emp.form);
          setValues(emp.values);

          // load form structure
          const formRes = await api.get("forms/");
          const form = formRes.data.data.find(
            (f) => f.id == emp.form
          );

          setFields(form.fields || []);
        }
      } catch (err) {
        toast.error("Failed to load employee");
      }
    };

    load();
  }, [id]);

  // HANDLE CHANGE
  const handleChange = (label, value) => {
    setValues((prev) => {
      const filtered = prev.filter((v) => v.label !== label);
      return [...filtered, { label, value }];
    });
  };

  // UPDATE
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
        navigate("/employees");
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">

        <Link to="/dashboard" className="dashboard-link">
          ⬅ Back to Dashboard
        </Link>

        <h2>Edit Employee</h2>

        {fields.map((field, index) => {
          const existing = values.find(
            (v) => v.label === field.label
          );

          return (
            <div key={index} className="field-row">
              <label>{field.label}</label>

              <input
                type={field.field_type}
                placeholder={field.placeholder}
                defaultValue={existing?.value || ""}
                onChange={(e) =>
                  handleChange(field.label, e.target.value)
                }
              />
            </div>
          );
        })}

        <div className="button-row">
          <button className="save-btn" onClick={update}>
            Update Employee
          </button>
        </div>
      </div>
    </div>
  );
}