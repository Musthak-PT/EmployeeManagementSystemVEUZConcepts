import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../pagescss/employeecreate.css";

export default function EmployeeCreate() {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState("");
  const [values, setValues] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      const res = await api.get("forms/");
      setForms(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load forms");
    }
  };

  const handleChange = (label, value) => {
    setValues((prev) => {
      const filtered = prev.filter((v) => v.label !== label);
      return [...filtered, { label, value }];
    });
  };

  const submit = async () => {
    try {
      const res = await api.post("employees/create/", {
        form: Number(selectedForm),
        values,
      });

      if (res.data.success) {
        toast.success(
          res.data.message || "Employee created successfully"
        );

        setValues([]);
        setSelectedForm("");

        // 👉 redirect to dashboard
        setTimeout(() => {
          navigate("/dashboard");
        }, 800);
      } else {
        toast.error(res.data.message || "Something went wrong");
      }

    } catch (err) {
      console.log(err);

      const errorData = err.response?.data;

      if (errorData && typeof errorData === "object") {
        const firstKey = Object.keys(errorData)[0];

        const message = Array.isArray(errorData[firstKey])
          ? errorData[firstKey][0]
          : errorData[firstKey];

        toast.error(message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const selectedFormData = forms.find(
    (f) => f.id == selectedForm
  );

  return (
    <div className="emp-container">
      <div className="emp-card">
        <h2>Create Employee</h2>

        {/* FORM SELECT */}
        <select
          value={selectedForm}
          onChange={(e) => {
            setSelectedForm(e.target.value);
            setValues([]);
          }}
        >
          <option value="">Select Form</option>
          {forms.map((f) => (
            <option key={f.id} value={f.id}>
              {f.title}
            </option>
          ))}
        </select>

        {/* DYNAMIC FIELDS */}
        {selectedFormData?.fields?.map((field, index) => (
          <div key={index} className="field-block">
            <label>{field.label}</label>

            <input
              type={field.field_type}
              placeholder={field.placeholder || ""}
              onChange={(e) =>
                handleChange(field.label, e.target.value)
              }
            />
          </div>
        ))}

        <button onClick={submit}>
          Create Employee
        </button>
      </div>
    </div>
  );
}