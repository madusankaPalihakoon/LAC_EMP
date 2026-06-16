import { useState } from "react";
import API from "../api/axios";

export default function ChangePassword() {
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("change-password/", form);
      alert("Password changed");
    } catch (err) {
      alert("Error changing password");
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow w-80"
      >
        <h2 className="text-xl font-bold mb-4">Change Password</h2>

        <input
          type="password"
          placeholder="Old Password"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setForm({ ...form, old_password: e.target.value })}
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setForm({ ...form, new_password: e.target.value })}
        />

        <button className="w-full bg-purple-500 text-white p-2 rounded">
          Change Password
        </button>
      </form>
    </div>
  );
}
