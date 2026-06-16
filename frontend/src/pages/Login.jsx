import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // validation
    if (!form.username || !form.password) {
      setError("Please enter username and password");
      return;
    }

    try {
      const res = await API.post("login/", form);
      console.log(res);

      // save token
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("center", res.data.center);

      // redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.log("ERROR:", err);
      console.log("Response:", err.response);
      console.log("Data:", err.response?.data);

      setError(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          "Invalid username or password",
      );

      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        {/* ✅ Error message */}
        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <input
          type="text"
          name="username"
          autoComplete="username"
          placeholder="Username"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition">
          Login
        </button>

        {/* ✅ Signup link */}
        <p className="text-sm mt-4 text-center">
          Don’t have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Signup
          </span>
        </p>
      </form>
    </div>
  );
}
