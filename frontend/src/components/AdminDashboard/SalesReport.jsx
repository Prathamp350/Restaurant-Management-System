import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const SalesReport = ({ salesData }) => {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    // Process Sales Data
    const salesMap = {};
    salesData.forEach((sale) => {
      if (!salesMap[sale.tableOrGuest]) {
        salesMap[sale.tableOrGuest] = { tableOrGuest: sale.tableOrGuest, totalSales: 0, orderCount: 0 };
      }
      salesMap[sale.tableOrGuest].totalSales += sale.totalPrice;
      salesMap[sale.tableOrGuest].orderCount += 1;
    });

    // Convert to Array
    setSummary(Object.values(salesMap));
  }, [salesData]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Sales Report</h2>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={summary}>
          <XAxis dataKey="tableOrGuest" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="totalSales" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      {/* Line Chart */}
      <h3 className="mt-6 text-lg font-semibold">Sales Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={summary}>
          <XAxis dataKey="tableOrGuest" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="totalSales" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesReport;
