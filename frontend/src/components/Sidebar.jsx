import {
  FaUsers,
  FaUserTie,
  FaMoneyBillWave,
  FaUmbrellaBeach,
  FaUserShield,
  FaCog,
  FaTachometerAlt,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menu = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/" },
    { name: "Employee Management", icon: <FaUserTie />, path: "/employees" },
    {
      name: "Increment Management",
      icon: <FaMoneyBillWave />,
      path: "/increments",
    },
    { name: "Pension Management", icon: <FaUsers />, path: "/pension" },
    { name: "Leave Management", icon: <FaUmbrellaBeach />, path: "/leave" },
    { name: "User Management", icon: <FaUserShield />, path: "/users" },
    { name: "Settings", icon: <FaCog />, path: "/settings" },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-slate-900 text-white p-5">
      <h1 className="text-2xl font-bold mb-10 text-center">HR System</h1>

      <ul className="space-y-4">
        {menu.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded transition ${
                  isActive ? "bg-slate-700" : "hover:bg-slate-700"
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
