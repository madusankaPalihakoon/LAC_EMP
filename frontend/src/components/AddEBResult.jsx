import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function AddEBResult() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [form, setForm] = useState({
    employee: "",
    employee_name: "",
    subject: "",
    result: "PASS",
    marks: "",
    exam_date: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const empRes = await API.get("employees/");
      const subRes = await API.get("eb-subjects/");

      setEmployees(empRes.data);
      setSubjects(subRes.data);
    } catch (err) {
      console.error(err);
    }
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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveResult = async (e) => {
    e.preventDefault();

    try {
      await API.post("eb-exams/", {
        employee: form.employee,
        subject: form.subject,
        result: form.result,
        marks: form.marks,
        exam_date: form.exam_date,
      });

      alert("Result Added Successfully");
      navigate("/eb-management");
    } catch (err) {
      console.error(err);
      alert("Failed to Save");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Add EB Result</h1>

      <form onSubmit={saveResult} className="grid grid-cols-2 gap-4">
        <select
          value={form.employee}
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
          placeholder="Employee Name"
          className="border p-2 rounded bg-gray-100"
        />

        <select
          name="subject"
          value={form.subject}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Subject</option>

          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.subject_name}
            </option>
          ))}
        </select>

        <select
          name="result"
          value={form.result}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="PASS">PASS</option>
          <option value="FAIL">FAIL</option>
          <option value="ABSENT">ABSENT</option>
          <option value="EXEMPTED">EXEMPTED</option>
        </select>

        <input
          name="marks"
          type="number"
          step="0.01"
          placeholder="Marks"
          value={form.marks}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="date"
          name="exam_date"
          value={form.exam_date}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <button type="submit" className="bg-green-600 text-white p-2 rounded">
          Save
        </button>
      </form>
    </div>
  );
}
