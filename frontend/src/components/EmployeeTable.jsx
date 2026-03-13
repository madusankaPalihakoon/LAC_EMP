import React from "react";

export default function EmployeeTable({ employees, deleteEmployee }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-2 px-4">Employee ID</th>
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">NIC</th>
            <th className="py-2 px-4">Phone</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Center</th>
            <th className="py-2 px-4">Action</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} className="border-b">
              <td className="py-2 px-4">{emp.employee_id}</td>
              <td className="py-2 px-4">{emp.name}</td>
              <td className="py-2 px-4">{emp.nic}</td>
              <td className="py-2 px-4">{emp.phone}</td>
              <td className="py-2 px-4">{emp.email}</td>
              <td className="py-2 px-4">{emp.center}</td>

              <td className="py-2 px-4">
                <button
                  onClick={() => deleteEmployee(emp.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
