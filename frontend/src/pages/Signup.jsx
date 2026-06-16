import { useState } from "react";
import API from "../api/axios";

export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    center: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("signup/", form);
      alert("Signup success");
    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow w-80"
      >
        <h2 className="text-xl font-bold mb-4">Signup</h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <input
          type="text"
          placeholder="Center"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setForm({ ...form, center: e.target.value })}
        />

        <button className="w-full bg-green-500 text-white p-2 rounded">
          Signup
        </button>
      </form>
    </div>
  );
}
