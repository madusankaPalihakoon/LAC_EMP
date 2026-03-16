import { useEffect, useState } from "react";
import API from "../api/axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Increment() {
  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState({
    employee_id: "",
    year: "",
    month: "",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const res = await API.get("employees/");
    setEmployees(res.data);
    setFiltered(res.data);
  };

  const calculateNextIncrement = (emp) => {
    const baseDate = emp.promotion_date || emp.appointment_date;
    if (!baseDate) return null;

    const base = new Date(baseDate);
    const currentYear = new Date().getFullYear();

    const next = new Date(base);
    next.setFullYear(currentYear);

    return next;
  };

  const handleChange = (e) => {
    setSearch({
      ...search,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = () => {
    const result = employees.filter((emp) => {
      const incDate = calculateNextIncrement(emp);
      if (!incDate) return false;

      const incYear = incDate.getFullYear().toString();
      const incMonth = (incDate.getMonth() + 1).toString();

      return (
        (search.employee_id === "" ||
          emp.employee_id.includes(search.employee_id)) &&
        (search.year === "" || incYear === search.year) &&
        (search.month === "" || incMonth === search.month)
      );
    });

    setFiltered(result);
  };

  const exportToExcel = () => {
    const data = filtered.map((emp) => {
      const baseDate = emp.promotion_date || emp.appointment_date;
      let nextIncrement = "";

      if (baseDate) {
        const base = new Date(baseDate);
        const currentYear = new Date().getFullYear();
        base.setFullYear(currentYear);
        nextIncrement = base.toISOString().split("T")[0];
      }

      return {
        "EMP ID": emp.employee_id,
        Name: emp.name,
        Designation: emp.current_designation,
        Center: emp.center_department,
        "Appointment Date": emp.appointment_date,
        "Promotion Date": emp.promotion_date || "",
        "Next Increment Date": nextIncrement,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Increment List");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(fileData, "increment_list.xlsx");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Increment Management</h1>

      <button
        onClick={exportToExcel}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Export Excel
      </button>

      {/* SEARCH PANEL */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <input
          name="employee_id"
          placeholder="Employee ID"
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="year"
          placeholder="Increment Year (2026)"
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="month"
          placeholder="Increment Month (1-12)"
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

      {/* TABLE */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>EMP ID</th>
            <th>Name</th>
            <th>Designation</th>
            <th>Center</th>
            <th>Appointment</th>
            <th>Promotion</th>
            <th>Next Increment</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((emp) => {
            const incDate = calculateNextIncrement(emp);

            return (
              <tr key={emp.id} className="text-center border-t">
                <td>{emp.employee_id}</td>
                <td>{emp.name}</td>
                <td>{emp.current_designation}</td>
                <td>{emp.center_department}</td>
                <td>{emp.appointment_date}</td>
                <td>{emp.promotion_date || "-"}</td>

                <td className="font-semibold text-green-700">
                  {incDate ? incDate.toISOString().split("T")[0] : "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
