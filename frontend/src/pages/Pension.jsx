import React, { useEffect, useState } from "react";
import API from "../api/axios";

export default function Pension() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await API.get("employees/");
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getDOBFromNIC = (nic) => {
    if (!nic) return null;

    nic = nic.toString().trim();

    const oldNIC = /^[0-9]{9}[vVxX]$/;
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

    const dob = new Date(year, 0);
    dob.setDate(days);

    return dob;
  };

  const getDOB = (employee) => {
    if (employee.date_of_birth) {
      return new Date(employee.date_of_birth);
    }

    return getDOBFromNIC(employee.identity_card_number);
  };

  const getPensionDate = (employee) => {
    const dob = getDOB(employee);

    if (!dob) return null;

    const pension = new Date(dob);

    pension.setFullYear(pension.getFullYear() + 60);

    return pension;
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.epf_no?.toLowerCase().includes(search.toLowerCase()) ||
      emp.employee_name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pension Management</h1>

        <input
          type="text"
          placeholder="Search EPF / Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-80"
        />
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200 text-center">
            <th className="p-2">EPF No</th>

            <th className="p-2">Employee Name</th>

            <th className="p-2">Designation</th>

            <th className="p-2">Center</th>

            <th className="p-2">NIC</th>

            <th className="p-2">Date of Birth</th>

            <th className="p-2">Pension Date</th>
          </tr>
        </thead>

        <tbody>
          {filteredEmployees.map((emp) => {
            const dob = getDOB(emp);

            const pension = getPensionDate(emp);

            return (
              <tr key={emp.id} className="border-t text-center">
                <td className="p-2">{emp.epf_no}</td>

                <td className="p-2">{emp.employee_name}</td>

                <td className="p-2">{emp.designation}</td>

                <td className="p-2">{emp.center}</td>

                <td className="p-2">{emp.identity_card_number}</td>

                <td className="p-2">
                  {dob ? dob.toISOString().split("T")[0] : "-"}
                </td>

                <td className="p-2 text-red-600 font-semibold">
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
