import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    employee_id: "",
    name: "",
    nic: "",
    phone: "",
    email: "",
    center: "",
  });

  useEffect(() => {
    fetchEmployee();
  }, []);

  const fetchEmployee = async () => {
    const res = await API.get(`employees/${id}/`);
    setForm(res.data);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const updateEmployee = async () => {
    await API.put(`employees/${id}/`, form);
    navigate("/employees");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Employee</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <input
          name="employee_id"
          value={form.employee_id}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          name="nic"
          value={form.nic}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          name="center"
          value={form.center}
          onChange={handleChange}
          className="border p-2"
        />
      </div>

      <button
        onClick={updateEmployee}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Update Employee
      </button>
    </div>
  );
}
