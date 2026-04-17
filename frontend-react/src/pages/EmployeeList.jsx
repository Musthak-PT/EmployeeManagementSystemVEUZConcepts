// // import { useEffect, useState } from "react";
// // import api from "../api/axios";
// // import { toast } from "react-toastify";
// // import { useNavigate } from "react-router-dom";
// // import "../pagescss/employeelist.css";

// // export default function EmployeeList() {
// //   const [list, setList] = useState([]);
// //   const navigate = useNavigate();

// //   const load = async () => {
// //     try {
// //       const res = await api.get("employees/");
// //       setList(res.data.data || []);
// //     } catch (err) {
// //       toast.error("Failed to load employees");
// //     }
// //   };

// //   useEffect(() => {
// //     load();
// //   }, []);

// //   const remove = async (id) => {
// //     try {
// //       await api.delete(`employees/${id}/delete/`);
// //       toast.success("Deleted successfully");
// //       load();
// //     } catch (err) {
// //       toast.error("Delete failed");
// //     }
// //   };

// //   return (
// //     <div className="emp-list-container">
// //       <h2>Employees</h2>

// //       {/* EMPTY STATE */}
// //       {list.length === 0 ? (
// //         <div className="empty-state">
// //           <h3>No Employees Found</h3>
// //           <p>Create your first employee to see it here</p>
// //         </div>
// //       ) : (
// //         <div className="grid">
// //           {list.map((item) => (
// //             <div key={item.id} className="card">
// //               <h3>{item.form_title}</h3>

// //               <div className="values">
// //                 {item.values.map((v, i) => (
// //                   <p key={i}>
// //                     <span>{v.label}:</span> {v.value}
// //                   </p>
// //                 ))}
// //               </div>

// //               <div className="actions">
// //                 <button
// //                   className="view"
// //                   onClick={() =>
// //                     navigate(`/employees/view/${item.id}`)
// //                   }
// //                 >
// //                   View
// //                 </button>

// //                 <button
// //                   className="edit"
// //                   onClick={() =>
// //                     navigate(`/employees/edit/${item.id}`)
// //                   }
// //                 >
// //                   Edit
// //                 </button>

// //                 <button
// //                   className="delete"
// //                   onClick={() => remove(item.id)}
// //                 >
// //                   Delete
// //                 </button>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

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

//                 {/* EDIT ONLY */}
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
      <h2>Employees</h2>

      {/* ===============================
          🔍 SEARCH INPUT (NEW)
      =============================== */}
      <input
        type="text"
        placeholder="Search by title, label and value..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-box"
      />

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