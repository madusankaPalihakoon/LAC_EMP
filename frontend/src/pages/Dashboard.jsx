import { useEffect, useState } from "react";
import API from "../api/axios";

import {
  FaUsers,
  FaMoneyBillWave,
  FaUmbrellaBeach,
  FaUserTie,
} from "react-icons/fa";

export default function Dashboard() {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [pendingIncrements, setPendingIncrements] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const calculateNextIncrement = (emp) => {
    const baseDate = emp.promotion_date || emp.appointment_date;
    if (!baseDate) return null;

    const base = new Date(baseDate);
    const currentYear = new Date().getFullYear();

    const next = new Date(base);
    next.setFullYear(currentYear);

    return next;
  };

  const fetchDashboardData = async () => {
    const res = await API.get("employees/");
    const employees = res.data;

    setTotalEmployees(employees.length);

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const incrementsThisMonth = employees.filter((emp) => {
      const incDate = calculateNextIncrement(emp);

      if (!incDate) return false;

      return (
        incDate.getMonth() === currentMonth &&
        incDate.getFullYear() === currentYear
      );
    });

    setPendingIncrements(incrementsThisMonth.length);
  };

  const cards = [
    {
      title: "Total Employees",
      value: totalEmployees,
      icon: <FaUserTie size={28} />,
      color: "bg-blue-500",
    },
    {
      title: "Pending Increments (This Month)",
      value: pendingIncrements,
      icon: <FaMoneyBillWave size={28} />,
      color: "bg-green-500",
    },
    {
      title: "Leave Requests",
      value: "0",
      icon: <FaUmbrellaBeach size={28} />,
      color: "bg-yellow-500",
    },
    {
      title: "System Users",
      value: "0",
      icon: <FaUsers size={28} />,
      color: "bg-purple-500",
    },
  ];

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl text-white shadow ${card.color}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm">{card.title}</p>
                <h2 className="text-2xl font-bold">{card.value}</h2>
              </div>

              {card.icon}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
