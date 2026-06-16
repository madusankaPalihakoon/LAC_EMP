import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  // 🔓 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // 🔑 Change Password
  const handleChangePassword = () => {
    navigate("/change-password");
  };

  // 👤 Admin Login
  const handleAdminLogin = () => {
    navigate("/"); // or "/admin-login" if you create separate page
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="grid gap-4 max-w-md">
        {/* Change Password */}
        <button
          onClick={handleChangePassword}
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg shadow"
        >
          🔑 Change Password
        </button>

        {/* Admin Login */}
        <button
          onClick={handleAdminLogin}
          className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg shadow"
        >
          👤 Admin Login
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg shadow"
        >
          🔓 Logout
        </button>
      </div>
    </div>
  );
}
