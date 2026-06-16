import React, { useEffect, useState } from "react";
import API from "../api/axios";
import EmployeeTable from "../components/EmployeeTable";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const [search, setSearch] = useState({
    epf_no: "",
    employee_name: "",
    designation: "",
    center: "",
    identity_card_number: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await API.get("employees/");
      setEmployees(res.data);
      setFilteredEmployees(res.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSearch((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const filtered = employees.filter((emp) => {
      return (
        (search.epf_no === "" ||
          emp.epf_no?.toString().includes(search.epf_no)) &&
        (search.employee_name === "" ||
          emp.employee_name
            ?.toLowerCase()
            .includes(search.employee_name.toLowerCase())) &&
        (search.designation === "" ||
          emp.designation
            ?.toLowerCase()
            .includes(search.designation.toLowerCase())) &&
        (search.center === "" ||
          emp.center?.toLowerCase().includes(search.center.toLowerCase())) &&
        (search.identity_card_number === "" ||
          emp.identity_card_number
            ?.toLowerCase()
            .includes(search.identity_card_number.toLowerCase()))
      );
    });

    setFilteredEmployees(filtered);
  }, [search, employees]);

  const deleteEmployee = async (id) => {
    try {
      await API.delete(`employees/${id}/`);
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const editEmployee = (id) => {
    navigate(`/employees/edit/${id}`);
  };

  const exportToExcel = () => {
    const data = filteredEmployees.map((emp) => ({
      "EPF No": emp.epf_no,
      Center: emp.center,
      "Employee Name": emp.employee_name,
      Designation: emp.designation,
      "Date Joined": emp.date_joined,
      NIC: emp.identity_card_number,
      "Date Of Birth": emp.date_of_birth,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(file, "Employees.xlsx");
  };

  return (
    <div className="p-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Employee Management</h1>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/employees/add")}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Employee
          </button>

          <button
            onClick={exportToExcel}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Export Excel
          </button>
        </div>
      </div>

      {/* Search Panel */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <input
          name="epf_no"
          placeholder="EPF No"
          value={search.epf_no}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="employee_name"
          placeholder="Employee Name"
          value={search.employee_name}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="designation"
          placeholder="Designation"
          value={search.designation}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="center"
          placeholder="Center"
          value={search.center}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="identity_card_number"
          placeholder="NIC"
          value={search.identity_card_number}
          onChange={handleChange}
          className="border p-2 rounded"
        />
      </div>

      <EmployeeTable
        employees={filteredEmployees}
        deleteEmployee={deleteEmployee}
        editEmployee={editEmployee}
      />
    </div>
  );
}
