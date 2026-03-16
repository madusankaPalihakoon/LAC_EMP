import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function AddEmployee() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    employee_id: "",
    name: "",
    nic: "",
    phone: "",
    email: "",
    center: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addEmployee = async () => {
    await API.post("employees/", form);
    navigate("/employees");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Add Employee</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <input
          name="employee_id"
          placeholder="Employee ID"
          onChange={handleChange}
          className="border p-2"
        />
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="border p-2"
        />
        <input
          name="nic"
          placeholder="NIC"
          onChange={handleChange}
          className="border p-2"
        />
        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          className="border p-2"
        />
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="border p-2"
        />
        <input
          name="center"
          placeholder="Center"
          onChange={handleChange}
          className="border p-2"
        />
      </div>

      <button
        onClick={addEmployee}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Save Employee
      </button>
    </div>
  );
}
