// import { useEffect, useState } from "react";
// import api from "../api/axios";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import "../pagescss/employeelist.css";

// export default function EmployeeList() {
//   const [list, setList] = useState([]);
//   const navigate = useNavigate();

//   const load = async () => {
//     try {
//       const res = await api.get("employees/");
//       setList(res.data.data || []);
//     } catch (err) {
//       toast.error("Failed to load employees");
//     }
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   const remove = async (id) => {
//     try {
//       await api.delete(`employees/${id}/delete/`);
//       toast.success("Deleted successfully");
//       load();
//     } catch (err) {
//       toast.error("Delete failed");
//     }
//   };

//   return (
//     <div className="emp-list-container">
//       <h2>Employees</h2>

//       {/* EMPTY STATE */}
//       {list.length === 0 ? (
//         <div className="empty-state">
//           <h3>No Employees Found</h3>
//           <p>Create your first employee to see it here</p>
//         </div>
//       ) : (
//         <div className="grid">
//           {list.map((item) => (
//             <div key={item.id} className="card">
//               <h3>{item.form_title}</h3>

//               <div className="values">
//                 {item.values.map((v, i) => (
//                   <p key={i}>
//                     <span>{v.label}:</span> {v.value}
//                   </p>
//                 ))}
//               </div>

//               <div className="actions">
//                 <button
//                   className="view"
//                   onClick={() =>
//                     navigate(`/employees/view/${item.id}`)
//                   }
//                 >
//                   View
//                 </button>

//                 <button
//                   className="edit"
//                   onClick={() =>
//                     navigate(`/employees/edit/${item.id}`)
//                   }
//                 >
//                   Edit
//                 </button>

//                 <button
//                   className="delete"
//                   onClick={() => remove(item.id)}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../pagescss/employeelist.css";

export default function EmployeeList() {
  const [list, setList] = useState([]);
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

  return (
    <div className="emp-list-container">
      <h2>Employees</h2>

      {list.length === 0 ? (
        <div className="empty-state">
          <h3>No Employees Found</h3>
          <p>Create your first employee to see it here</p>
        </div>
      ) : (
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

                {/* EDIT ONLY */}
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