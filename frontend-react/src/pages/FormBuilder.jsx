import { useState } from "react";
import api from "../api/axios";
import "../pagescss/formbuilder.css";

import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";


// ----------------------
// DRAGGABLE FIELD
// ----------------------
function SortableField({ field, index, fields, setFields }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: index });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const updateField = (key, value) => {
    const temp = [...fields];
    temp[index][key] = value;
    setFields(temp);
  };

  return (
    <div ref={setNodeRef} style={style} className="field-row">

      {/* Drag handle only */}
      <span className="drag-handle" {...attributes} {...listeners}>
        ☰
      </span>

      <input
        placeholder="Enter Label"
        value={field.label}
        onChange={(e) => updateField("label", e.target.value)}
      />

      <select
        value={field.field_type}
        onChange={(e) => updateField("field_type", e.target.value)}
      >
        <option value="" disabled>
          Select Option
        </option>
        <option value="text">Text</option>
        <option value="textarea">Textarea</option>
        <option value="number">Number</option>
        <option value="date">Date</option>
        <option value="password">Password</option>
        <option value="email">Email</option>
        <option value="phone">Phone</option>
      </select>
    </div>
  );
}


// ----------------------
// MAIN COMPONENT
// ----------------------
export default function FormBuilder() {
  const [title, setTitle] = useState("");
  const [fields, setFields] = useState([]);

  const navigate = useNavigate();

  // ADD FIELD
  const addField = () => {
    setFields([
      ...fields,
      {
        label: "",
        field_type: "",
        order: fields.length + 1,
        is_required: true,
        placeholder: "",
      },
    ]);
  };

  // DRAG END
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = active.id;
    const newIndex = over.id;

    const reordered = arrayMove(fields, oldIndex, newIndex);

    const updated = reordered.map((f, i) => ({
      ...f,
      order: i + 1,
    }));

    setFields(updated);
  };

  // SAVE FORM (WITH TOAST + NAVIGATION)
  const save = async () => {
    try {
      const res = await api.post("forms/create/", {
        title,
        fields,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Form created successfully");

        // reset form
        setTitle("");
        setFields([]);

        // redirect
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        toast.error(res.data.message || "Failed to create form");
      }

    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message || "Server error"
      );
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">


        {/* ✅ CHANGE 2: DASHBOARD LINK ADDED HERE */}
        <Link to="/dashboard" className="dashboard-link">
          ⬅ Back to Dashboard
        </Link>


        <h2>Create Dynamic Form</h2>

        <input
          className="title-input"
          placeholder="Form Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* DRAG DROP AREA */}
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields.map((_, i) => i)}
            strategy={verticalListSortingStrategy}
          >
            {fields.map((field, i) => (
              <SortableField
                key={i}
                index={i}
                field={field}
                fields={fields}
                setFields={setFields}
              />
            ))}
          </SortableContext>
        </DndContext>

        {/* BUTTONS */}
        <div className="button-row">
          <button className="add-btn" onClick={addField}>
            + Add Field
          </button>

          <button className="save-btn" onClick={save}>
            Save Form
          </button>
        </div>
      </div>
    </div>
  );
}