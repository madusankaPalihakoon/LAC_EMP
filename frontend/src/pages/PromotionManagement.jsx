import { useEffect, useState } from "react";
import API from "../api/axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function PromotionManagement() {
  const [promotions, setPromotions] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState({
    epf: "",
    name: "",
    year: "",
  });

  const [showForm, setShowForm] = useState(false);

  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    employee: "",
    employee_name: "",
    promotion_date: "",
    promotion_type: "",
    remarks: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const promoRes = await API.get("promotions/");
    const empRes = await API.get("employees/");

    setPromotions(promoRes.data);
    setFiltered(promoRes.data);
    setEmployees(empRes.data);
  };

  useEffect(() => {
    const result = promotions.filter((p) => {
      const year = p.promotion_date
        ? new Date(p.promotion_date).getFullYear().toString()
        : "";

      return (
        p.epf_no?.toString().includes(search.epf) &&
        p.employee_name?.toLowerCase().includes(search.name.toLowerCase()) &&
        (search.year === "" || year === search.year)
      );
    });

    setFiltered(result);
  }, [search, promotions]);

  const handleSearch = (e) => {
    setSearch({
      ...search,
      [e.target.name]: e.target.value,
    });
  };

  const handleEmployeeChange = (e) => {
    const employeeId = e.target.value;

    const employee = employees.find((emp) => String(emp.id) === employeeId);

    setForm({
      ...form,
      employee: employeeId,
      employee_name: employee?.employee_name || "",
    });
  };

  const savePromotion = async (e) => {
    e.preventDefault();

    try {
      await API.post("promotions/", {
        employee: form.employee,
        promotion_date: form.promotion_date,
        promotion_type: form.promotion_type,
        remarks: form.remarks,
      });

      alert("Promotion Added Successfully");

      setShowForm(false);

      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed");
    }
  };

  const deletePromotion = async (id) => {
    if (!window.confirm("Delete this promotion?")) return;

    await API.delete(`promotions/${id}/`);

    fetchData();
  };

  const exportExcel = () => {
    const data = filtered.map((item) => ({
      "EPF No": item.epf_no,
      Name: item.employee_name,
      "Promotion Date": item.promotion_date,
      Type: item.promotion_type,
      Remarks: item.remarks,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Promotions");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(file, "Promotion_Report.xlsx");
  };

  return (
    <div className="p-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Promotion Management</h1>

        <div className="flex gap-2">
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Promotion
          </button>

          <button
            onClick={exportExcel}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Export Excel
          </button>
        </div>
      </div>

      {/* SEARCH */}

      <div className="grid grid-cols-3 gap-4 mb-6">
        <input
          name="epf"
          placeholder="EPF No"
          onChange={handleSearch}
          className="border p-2 rounded"
        />

        <input
          name="name"
          placeholder="Employee Name"
          onChange={handleSearch}
          className="border p-2 rounded"
        />

        <input
          name="year"
          placeholder="Year"
          onChange={handleSearch}
          className="border p-2 rounded"
        />
      </div>

      {/* ADD FORM */}

      {showForm && (
        <form
          onSubmit={savePromotion}
          className="border p-4 rounded mb-6 bg-gray-50"
        >
          <div className="grid grid-cols-2 gap-4">
            <select
              onChange={handleEmployeeChange}
              className="border p-2 rounded"
              required
            >
              <option value="">Select Employee</option>

              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.epf_no} - {emp.employee_name}
                </option>
              ))}
            </select>

            <input
              value={form.employee_name}
              readOnly
              className="border p-2 rounded bg-gray-100"
            />

            <input
              type="date"
              value={form.promotion_date}
              onChange={(e) =>
                setForm({
                  ...form,
                  promotion_date: e.target.value,
                })
              }
              className="border p-2 rounded"
              required
            />

            <input
              placeholder="Promotion Type"
              value={form.promotion_type}
              onChange={(e) =>
                setForm({
                  ...form,
                  promotion_type: e.target.value,
                })
              }
              className="border p-2 rounded"
            />

            <textarea
              placeholder="Remarks"
              value={form.remarks}
              onChange={(e) =>
                setForm({
                  ...form,
                  remarks: e.target.value,
                })
              }
              className="border p-2 rounded col-span-2"
            />
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* TABLE */}

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>No</th>
            <th>EPF</th>
            <th>Name</th>
            <th>Promotion Date</th>
            <th>Type</th>
            <th>Remarks</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((item, index) => (
            <tr key={item.id} className="border-t text-center">
              <td>{index + 1}</td>

              <td>{item.epf_no}</td>

              <td>{item.employee_name}</td>

              <td>{item.promotion_date}</td>

              <td>{item.promotion_type}</td>

              <td>{item.remarks}</td>

              <td>
                <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
                  Edit
                </button>

                <button
                  onClick={() => deletePromotion(item.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
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
