import { useEffect, useState } from "react";
import API from "../api/axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Increment() {
  const [employees, setEmployees] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState({
    epf_no: "",
    year: "",
    month: "",
  });

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const empRes = await API.get("employees/");
      const promoRes = await API.get("promotions/");

      setEmployees(empRes.data);
      setPromotions(promoRes.data);
      setFiltered(empRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getLatestPromotion = (epfNo) => {
    const employeePromotions = promotions.filter((p) => p.epf_no === epfNo);

    if (!employeePromotions.length) {
      return null;
    }

    employeePromotions.sort(
      (a, b) => new Date(b.promotion_date) - new Date(a.promotion_date),
    );

    return employeePromotions[0];
  };

  const calculateNextIncrement = (employee) => {
    const promotion = getLatestPromotion(employee.epf_no);

    const sourceDate = promotion
      ? promotion.promotion_date
      : employee.date_joined;

    if (!sourceDate) {
      return null;
    }

    const source = new Date(sourceDate);

    const currentYear = new Date().getFullYear();

    return new Date(currentYear, source.getMonth(), source.getDate());
  };

  const handleChange = (e) => {
    setSearch({
      ...search,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = () => {
    const result = employees.filter((employee) => {
      const increment = calculateNextIncrement(employee);

      if (!increment) {
        return false;
      }

      const year = increment.getFullYear().toString();

      const month = (increment.getMonth() + 1).toString();

      return (
        (search.epf_no === "" ||
          employee.epf_no?.toString().includes(search.epf_no)) &&
        (search.year === "" || search.year === year) &&
        (search.month === "" || search.month === month)
      );
    });

    setFiltered(result);
  };

  const exportToExcel = () => {
    const data = filtered.map((employee) => {
      const promotion = getLatestPromotion(employee.epf_no);

      const increment = calculateNextIncrement(employee);

      return {
        "EPF No": employee.epf_no,
        Name: employee.employee_name,
        Designation: employee.designation,
        Center: employee.center,
        "Join Date": employee.date_joined,
        "Latest Promotion": promotion?.promotion_date || "",
        "Next Increment": increment?.toISOString().split("T")[0] || "",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Increment Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(file, "Increment_Report.xlsx");
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Increment Management</h1>

        <button
          onClick={exportToExcel}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Export Excel
        </button>
      </div>

      {/* SEARCH PANEL */}

      <div className="grid grid-cols-4 gap-4 mb-6">
        <input
          name="epf_no"
          placeholder="EPF No"
          value={search.epf_no}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <select
          name="year"
          value={search.year}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">All Years</option>

          <option value="2024">2024</option>

          <option value="2025">2025</option>

          <option value="2026">2026</option>

          <option value="2027">2027</option>

          <option value="2028">2028</option>

          <option value="2029">2029</option>

          <option value="2030">2030</option>
        </select>

        <select
          name="month"
          value={search.month}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">All Months</option>

          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white rounded"
        >
          Search
        </button>
      </div>

      {/* TABLE */}

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">EPF No</th>

              <th className="p-2">Name</th>

              <th className="p-2">Designation</th>

              <th className="p-2">Center</th>

              <th className="p-2">Join Date</th>

              <th className="p-2">Latest Promotion</th>

              <th className="p-2">Next Increment</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((employee) => {
              const promotion = getLatestPromotion(employee.epf_no);

              const increment = calculateNextIncrement(employee);

              return (
                <tr key={employee.id} className="border-t text-center">
                  <td>{employee.epf_no}</td>

                  <td>{employee.employee_name}</td>

                  <td>{employee.designation}</td>

                  <td>{employee.center}</td>

                  <td>{employee.date_joined}</td>

                  <td>{promotion?.promotion_date || "-"}</td>

                  <td className="font-semibold text-green-700">
                    {increment?.toISOString().split("T")[0] || "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
