import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function EBManagement() {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  const [search, setSearch] = useState({
    epf: "",
    name: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await API.get("eb-exams/");

      const grouped = {};

      res.data.forEach((item) => {
        const epf = item.epf_no;

        if (!grouped[epf]) {
          grouped[epf] = {
            epf_no: item.epf_no,
            employee_name: item.employee_name,
            exam_date: item.exam_date,

            admin: "",
            finance: "",
            management: "",

            result: item.result,
            records: [],
          };
        }

        grouped[epf].records.push(item);

        const subject = item.subject_name?.toLowerCase().trim();

        if (subject.includes("administration")) {
          grouped[epf].admin = item.marks;
        }

        if (subject.includes("finance")) {
          grouped[epf].finance = item.marks;
        }

        if (subject.includes("management")) {
          grouped[epf].management = item.marks;
        }
      });

      const finalData = Object.values(grouped);

      setResults(finalData);
      setFilteredResults(finalData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const filtered = results.filter((item) => {
      return (
        item.epf_no
          ?.toString()
          .toLowerCase()
          .includes(search.epf.toLowerCase()) &&
        item.employee_name?.toLowerCase().includes(search.name.toLowerCase())
      );
    });

    setFilteredResults(filtered);
  }, [search, results]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSearch((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const exportExcel = () => {
    const data = filteredResults.map((item) => ({
      "EPF No": item.epf_no,
      Employee: item.employee_name,
      "Administration Policy": item.admin,
      Finance: item.finance,
      Management: item.management,
      Result: item.result,
      "Exam Date": item.exam_date,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "EB Results");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(file, "EB_Results.xlsx");
  };

  const deleteEmployeeResults = async (epf) => {
    const confirmDelete = window.confirm(
      `Delete all EB records for EPF ${epf}?`,
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`eb-exams/delete-by-epf/?epf=${epf}`);

      fetchResults();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="p-8">
      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">EB Management</h1>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/eb-management/add")}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Result
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

      <div className="grid grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          name="epf"
          placeholder="Search EPF No"
          value={search.epf}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="name"
          placeholder="Search Employee Name"
          value={search.name}
          onChange={handleChange}
          className="border p-2 rounded"
        />
      </div>

      {/* TABLE */}

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="p-2">No</th>

              <th className="p-2">EPF No</th>

              <th className="p-2">Employee Name</th>

              <th className="p-2">Administration Policy</th>

              <th className="p-2">Finance Management</th>

              <th className="p-2">Management (General)</th>

              <th className="p-2">Exam Date</th>

              <th className="p-2">Result</th>

              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredResults.map((item, index) => (
              <tr key={item.epf_no} className="border-t text-center">
                <td className="p-2">{index + 1}</td>

                <td className="p-2">{item.epf_no}</td>

                <td className="p-2">{item.employee_name}</td>

                <td className="p-2">{item.admin}</td>

                <td className="p-2">{item.finance}</td>

                <td className="p-2">{item.management}</td>

                <td className="p-2">{item.exam_date}</td>

                <td className="p-2">{item.result}</td>

                <td className="space-x-2 p-2">
                  <button
                    onClick={() => navigate(`/eb-management/${item.epf_no}`)}
                    className="bg-sky-600 text-white px-2 py-1 rounded"
                  >
                    View
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/eb-management/edit/${item.epf_no}`)
                    }
                    className="bg-blue-600 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteEmployeeResults(item.epf_no)}
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
    </div>
  );
}
