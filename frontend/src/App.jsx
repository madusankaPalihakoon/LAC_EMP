import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "./components/DashboardLayout";

import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Increment from "./pages/Increment";
import Pension from "./pages/Pension";
import Leave from "./pages/Leave";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import AddEmployee from "./pages/AddEmployee";
import EditEmployee from "./pages/EditEmployee";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChangePassword from "./pages/ChangePassword";
import ProtectedRoute from "./components/ProtectedRoute";
import EBManagement from "./pages/EBManagement";
import PromotionManagement from "./pages/PromotionManagement";
import AddEBResult from "./components/AddEBResult";
import EditEBResult from "./components/EditEBResult";
import EBDetails from "./components/EBDetails";

function App() {
  return (
    <Routes>
      {/* 🔓 Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/change-password" element={<ChangePassword />} />

      {/* 🔐 Protected Dashboard */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/employees/add" element={<AddEmployee />} />
        <Route path="/employees/edit/:id" element={<EditEmployee />} />
        <Route path="/eb-management" element={<EBManagement />} />
        <Route path="/eb-management/add" element={<AddEBResult />} />

        <Route path="/eb-management/edit/:epf" element={<EditEBResult />} />

        <Route path="/eb-management/:epf" element={<EBDetails />} />
        <Route path="/promotions" element={<PromotionManagement />} />
        <Route path="/increments" element={<Increment />} />
        <Route path="/pension" element={<Pension />} />
        <Route path="/leave" element={<Leave />} />
        <Route path="/users" element={<Users />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Route>
    </Routes>
  );
}

export default App;
