import React, { useEffect, useState } from "react";
import API from "../api/axios";
import EmployeeTable from "../components/EmployeeTable";

export default function Employees() {
  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    employee_id: "",
    name: "",
    nic: "",
    phone: "",
    email: "",
    center: "",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const res = await API.get("employees/");
    setEmployees(res.data);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addEmployee = async () => {
    await API.post("employees/", form);
    fetchEmployees();
  };

  const deleteEmployee = async (id) => {
    await API.delete(`employees/${id}/`);
    fetchEmployees();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Employee Management</h1>

      {/* Add Employee Form */}

      <div className="grid grid-cols-3 gap-4 mb-6">
        <input
          name="employee_id"
          placeholder="Employee ID"
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="nic"
          placeholder="NIC"
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="center"
          placeholder="Center"
          onChange={handleChange}
          className="border p-2 rounded"
        />
      </div>

      <button
        onClick={addEmployee}
        className="bg-green-600 text-white px-4 py-2 rounded mb-6"
      >
        Add Employee
      </button>

      <EmployeeTable employees={employees} deleteEmployee={deleteEmployee} />
    </div>
  );
}
