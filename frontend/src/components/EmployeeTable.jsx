export default function EmployeeTable({
  employees,
  deleteEmployee,
  editEmployee,
}) {
  const getDOBFromNIC = (nic) => {
    if (!nic) return "-";

    nic = nic.trim();

    let year, dayOfYear;

    // OLD NIC (e.g. 787983154V)
    if (/^\d{9}[VvXx]$/.test(nic)) {
      year = parseInt("19" + nic.substring(0, 2));
      dayOfYear = parseInt(nic.substring(2, 5));
    }
    // NEW NIC (e.g. 197286003062)
    else if (/^\d{12}$/.test(nic)) {
      year = parseInt(nic.substring(0, 4));
      dayOfYear = parseInt(nic.substring(4, 7));
    } else {
      return "-";
    }

    // Female NIC
    if (dayOfYear > 500) {
      dayOfYear -= 500;
    }

    const date = new Date(year, 0);
    date.setDate(dayOfYear);

    return date.toISOString().split("T")[0];
  };
  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-3 py-2">No</th>
            <th className="border px-3 py-2">EPF No</th>
            <th className="border px-3 py-2">Center</th>
            <th className="border px-3 py-2">Employee Name</th>
            <th className="border px-3 py-2">Designation</th>
            <th className="border px-3 py-2">Date Joined</th>
            <th className="border px-3 py-2">NIC</th>
            <th className="border px-3 py-2">Date of Birth</th>
            <th className="border px-3 py-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.length > 0 ? (
            employees.map((emp, index) => (
              <tr
                key={emp.id}
                className="text-center border-t hover:bg-gray-50"
              >
                <td className="border px-3 py-2">{index + 1}</td>

                <td className="border px-3 py-2">{emp.epf_no || "-"}</td>

                <td className="border px-3 py-2">{emp.center || "-"}</td>

                <td className="border px-3 py-2">{emp.employee_name || "-"}</td>

                <td className="border px-3 py-2">{emp.designation || "-"}</td>

                <td className="border px-3 py-2">{emp.date_joined || "-"}</td>

                <td className="border px-3 py-2">
                  {emp.identity_card_number || "-"}
                </td>

                <td className="border px-3 py-2">
                  {emp.date_of_birth || getDOBFromNIC(emp.identity_card_number)}
                </td>

                <td className="border px-3 py-2 space-x-2">
                  <button
                    onClick={() => editEmployee(emp.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteEmployee(emp.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="9"
                className="border px-3 py-4 text-center text-gray-500"
              >
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
