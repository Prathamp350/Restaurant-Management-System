import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import moment from "moment";
import "../styles/SalesReport.css";

const SalesReport = () => {
  const [timeframe, setTimeframe] = useState("daily");
  const [salesData, setSalesData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [gstTotal, setGstTotal] = useState(0);

  useEffect(() => {
    fetchSalesData();
  }, [timeframe]);

  const fetchSalesData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/orders");
      const filteredData = filterOrdersByTimeframe(response.data);
      processSalesData(filteredData);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  const filterOrdersByTimeframe = (orders) => {
    const now = moment();
    return orders.filter((order) => {
      const orderDate = moment(order.createdAt);
      if (timeframe === "daily") {
        return orderDate.isSame(now, "day");
      } else if (timeframe === "monthly") {
        return orderDate.isSame(now, "month");
      } else if (timeframe === "yearly") {
        return orderDate.isSame(now, "year");
      }
      return false;
    });
  };

  const processSalesData = (orders) => {
    let revenue = 0;
    let orderCount = orders.length;
    let dailySales = {};

    orders.forEach((order) => {
      revenue += order.totalPrice;
      const dateKey = moment(order.createdAt).format("YYYY-MM-DD");
      dailySales[dateKey] = (dailySales[dateKey] || 0) + order.totalPrice;
    });

    const gst = revenue * 0.05; // 5% GST
    setTotalRevenue(revenue);
    setTotalOrders(orderCount);
    setGstTotal(gst);

    setSalesData(
      Object.keys(dailySales).map((date) => ({
        date,
        totalSales: dailySales[date],
      }))
    );
  };

  const chartData = {
    labels: salesData.map((data) => data.date),
    datasets: [
      {
        label: "Total Sales (Rs)",
        data: salesData.map((data) => data.totalSales),
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="sales-report">
      <h1>Sales Report</h1>

      <div className="filters">
        <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <div className="stats">
        <h3>Total Orders: {totalOrders}</h3>
        <h3>Total Revenue: {totalRevenue.toFixed(2)} Rs</h3>
        <h3>GST (5%): {gstTotal.toFixed(2)} Rs</h3>
      </div>

      <div className="chart-container">
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default SalesReport;
