import React, { useEffect, useState } from "react";
import API from "../api/axios";
import EmployeeTable from "../components/EmployeeTable";
import { useNavigate } from "react-router-dom";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const [search, setSearch] = useState({
    employee_id: "",
    designation: "",
    center: "",
    nic: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const res = await API.get("employees/");
    setEmployees(res.data);
    setFilteredEmployees(res.data);
  };

  const handleChange = (e) => {
    setSearch({
      ...search,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = () => {
    const filtered = employees.filter((emp) => {
      return (
        (search.employee_id === "" ||
          emp.employee_id?.toString().includes(search.employee_id)) &&
        (search.designation === "" ||
          emp.current_designation
            ?.toLowerCase()
            .includes(search.designation.toLowerCase())) &&
        (search.center === "" ||
          emp.center_department
            ?.toLowerCase()
            .includes(search.center.toLowerCase())) &&
        (search.nic === "" ||
          emp.nic_number?.toLowerCase().includes(search.nic.toLowerCase()))
      );
    });

    setFilteredEmployees(filtered);
  };

  const deleteEmployee = async (id) => {
    await API.delete(`employees/${id}/`);
    fetchEmployees();
  };

  const editEmployee = (id) => {
    navigate(`/employees/edit/${id}`);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Employee Management</h1>

        <button
          onClick={() => navigate("/employees/add")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Employee
        </button>
      </div>

      {/* SEARCH PANEL */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <input
          name="employee_id"
          placeholder="EMP ID"
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="designation"
          placeholder="Designation"
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="center"
          placeholder="Center / Department"
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="nic"
          placeholder="NIC"
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white rounded"
        >
          Search
        </button>
      </div>

      <EmployeeTable
        employees={filteredEmployees}
        deleteEmployee={deleteEmployee}
        editEmployee={editEmployee}
      />
    </div>
  );
}
