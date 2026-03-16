export default function EmployeeTable({
  employees,
  deleteEmployee,
  editEmployee,
}) {
  return (
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-200">
          <th>EMP ID</th>
          <th>Name</th>
          <th>Designation</th>
          <th>Center/Department</th>
          <th>NIC</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Appointment Date</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {employees.map((emp) => (
          <tr key={emp.id} className="text-center border-t">
            <td>{emp.employee_id}</td>
            <td>{emp.name}</td>
            <td>{emp.current_designation}</td>
            <td>{emp.center_department}</td>
            <td>{emp.nic_number}</td>
            <td>{emp.phone_number}</td>
            <td>{emp.email}</td>
            <td>{emp.appointment_date}</td>

            <td className="space-x-1">
              <button
                onClick={() => editEmployee(emp.id)}
                className="bg-blue-500 text-white px-1  rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteEmployee(emp.id)}
                className="bg-red-500 text-white px-1 rounded"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
