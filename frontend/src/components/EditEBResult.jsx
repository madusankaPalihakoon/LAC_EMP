import React, { useEffect, useState } from "react";

import API from "../api/axios";

import { useNavigate, useParams } from "react-router-dom";

export default function EditEBResult() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);

  const [form, setForm] = useState({
    employee_name: "",
    subject: "",
    result: "",
    marks: "",
    exam_date: "",
  });

  useEffect(() => {
    fetchResult();
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    const res = await API.get("eb-subjects/");

    setSubjects(res.data);
  };

  const fetchResult = async () => {
    const res = await API.get(`eb-exams/${id}/`);

    setForm({
      employee_name: res.data.employee_name,

      subject: res.data.subject,

      result: res.data.result,

      marks: res.data.marks,

      exam_date: res.data.exam_date,
    });
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const updateResult = async (e) => {
    e.preventDefault();

    await API.put(`eb-exams/${id}/`, form);

    alert("Updated");
    navigate("/eb-management");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Edit EB Result</h1>

      <form onSubmit={updateResult} className="grid grid-cols-2 gap-4">
        <input
          value={form.employee_name}
          readOnly
          className="border p-2 rounded bg-gray-100"
        />

        <select
          name="subject"
          value={form.subject}
          onChange={handleChange}
          className="border p-2 rounded"
        >
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

        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Update
        </button>
      </form>
    </div>
  );
}
