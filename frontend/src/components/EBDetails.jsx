import React, { useEffect, useState } from "react";

import API from "../api/axios";

import { useParams } from "react-router-dom";

export default function EBDetails() {
  const { epf } = useParams();

  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    const res = await API.get(`eb-exams/?epf=${epf}`);

    setResults(res.data);
  };

  if (!results.length) return <div className="p-8">No Results Found</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">EB Details</h1>

      <div className="bg-white shadow p-4 rounded mb-5">
        <h2 className="font-bold text-lg">{results[0].employee_name}</h2>

        <p>EPF No : {results[0].epf_no}</p>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Subject</th>

            <th className="p-2">Result</th>

            <th className="p-2">Marks</th>

            <th className="p-2">Exam Date</th>
          </tr>
        </thead>

        <tbody>
          {results.map((item) => (
            <tr key={item.id} className="border-t text-center">
              <td className="p-2">{item.subject_name}</td>

              <td className="p-2">{item.result}</td>

              <td className="p-2">{item.marks}</td>

              <td className="p-2">{item.exam_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
