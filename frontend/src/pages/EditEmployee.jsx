import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    employee_id: "",
    name: "",
    nic_number: "",
    phone_number: "",
    email: "",
    center_department: "",
    designation: "",
    current_designation: "",
    appointment_date: "",
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
          autoComplete="off"
          name="employee_id"
          value={form.employee_id || ""}
          onChange={handleChange}
        />

        <input
          name="name"
          value={form.name || ""}
          onChange={handleChange}
          placeholder="Employee Name"
          className="border p-2 rounded"
        />

        <input
          name="nic_number"
          value={form.nic_number || ""}
          onChange={handleChange}
          placeholder="NIC Number"
          className="border p-2 rounded"
        />

        <input
          name="phone_number"
          value={form.phone_number || ""}
          onChange={handleChange}
          placeholder="Phone Number"
          className="border p-2 rounded"
        />

        <input
          name="email"
          value={form.email || ""}
          onChange={handleChange}
          placeholder="Email Address"
          className="border p-2 rounded"
        />

        <input
          name="center_department"
          value={form.center_department || ""}
          onChange={handleChange}
          placeholder="Center / Department"
          className="border p-2 rounded"
        />

        <select
          name="designation"
          value={form.designation || ""}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Select Designation</option>
          <option value="Director General">Director General</option>
          <option value="Legal Officer">Legal Officer</option>
          <option value="Additional Legal Officer">
            Additional Legal Officer
          </option>
          <option value="Provincial Legal Officer">
            Provincial Legal Officer
          </option>
          <option value="Management Assistant">Management Assistant</option>
          <option value="Administrative Officer">Administrative Officer</option>
          <option value="Office Assistant">Office Assistant</option>
        </select>

        <select
          name="current_designation"
          value={form.current_designation || ""}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Current Designation</option>
          <option value="Legal Officer">Legal Officer</option>
          <option value="Management Assistant">Management Assistant</option>
          <option value="Administrative Officer">Administrative Officer</option>
          <option value="Office Assistant">Office Assistant</option>
        </select>

        <input
          type="date"
          name="appointment_date"
          value={form.appointment_date || ""}
          onChange={handleChange}
          className="border p-2 rounded"
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
