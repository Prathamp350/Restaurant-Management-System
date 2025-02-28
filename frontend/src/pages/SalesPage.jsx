import React, { useEffect, useState } from "react";
import SalesReport from "../Sales-report"; // Import Sales Report Component

const SalesPage = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    // Simulating Fetching Sales Data (Replace with actual API)
    const mockData = [
      { tableOrGuest: "Table 1", totalPrice: 500 },
      { tableOrGuest: "Table 2", totalPrice: 700 },
      { tableOrGuest: "Table 1", totalPrice: 800 },
      { tableOrGuest: "Table 3", totalPrice: 600 },
      { tableOrGuest: "Table 2", totalPrice: 400 },
    ];
    setSalesData(mockData);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sales Page</h1>
      <SalesReport salesData={salesData} />
    </div>
  );
};

export default SalesPage;
