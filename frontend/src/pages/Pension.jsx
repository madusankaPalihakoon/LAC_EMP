import React, { useEffect, useState } from "react";
import API from "../api/axios";

export default function Pension() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const res = await API.get("employees/");
    setEmployees(res.data);
  };

  function getDOBfromNIC(nic) {
    if (!nic) return null;

    nic = nic.toString().trim();

    // Old NIC format check (9 digits + V/X)
    const oldNIC = /^[0-9]{9}[vVxX]$/;

    // New NIC format check (12 digits)
    const newNIC = /^[0-9]{12}$/;

    if (!oldNIC.test(nic) && !newNIC.test(nic)) {
      return null;
    }

    let year;
    let days;

    if (nic.length === 10) {
      year = parseInt(nic.substring(0, 2));
      days = parseInt(nic.substring(2, 5));
      year = year > 30 ? 1900 + year : 2000 + year;
    } else {
      year = parseInt(nic.substring(0, 4));
      days = parseInt(nic.substring(4, 7));
    }

    if (days > 500) {
      days -= 500;
    }

    const date = new Date(year, 0);
    date.setDate(days);

    return date;
  }

  function getPensionDate(nic) {
    const dob = getDOBfromNIC(nic);

    if (!dob) return null;

    const pension = new Date(dob);
    pension.setFullYear(dob.getFullYear() + 65);

    return pension;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Pension Management</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>EMP ID</th>
            <th>Name</th>
            <th>Designation</th>
            <th>Center</th>
            <th>NIC</th>
            <th>Date of Birth</th>
            <th>Pension Date</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => {
            const dob = getDOBfromNIC(emp.nic_number);
            const pension = getPensionDate(emp.nic_number);

            return (
              <tr key={emp.id} className="text-center border-t">
                <td>{emp.employee_id}</td>
                <td>{emp.name}</td>
                <td>{emp.current_designation}</td>
                <td>{emp.center_department}</td>

                <td>{emp.nic_number || "-"}</td>

                <td>{dob ? dob.toISOString().split("T")[0] : "Invalid NIC"}</td>

                <td className="text-red-600 font-semibold">
                  {pension ? pension.toISOString().split("T")[0] : "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
