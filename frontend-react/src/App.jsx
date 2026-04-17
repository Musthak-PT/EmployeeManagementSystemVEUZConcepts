import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import FormBuilder from "./pages/FormBuilder";
import EmployeeCreate from "./pages/EmployeeCreate";
import EmployeeList from "./pages/EmployeeList";
import Profile from "./pages/Profile";
import EmployeeEdit from "./pages/EmployeeEdit";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forms" element={<FormBuilder />} />
        <Route path="/employee-create" element={<EmployeeCreate />} />
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/employees/edit/:id" element={<EmployeeEdit />} />
      </Routes>
    </BrowserRouter>
  );
}