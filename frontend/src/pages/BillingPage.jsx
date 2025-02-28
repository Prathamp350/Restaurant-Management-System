import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import "../styles/BillingPage.css";

const BillingPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const { orderId = "Unknown" } = location.state || {};

  const [orderDetails, setOrderDetails] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    setCurrentDateTime(new Date().toLocaleString());

    if (orderId !== "Unknown") {
      const fetchOrderDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`);
          setOrderDetails(response.data);
        } catch (error) {
          console.error('Error fetching order details:', error);
        }
      };
      fetchOrderDetails();
    }
  }, [orderId]);

  const handlePrint = () => {
    const billContent = document.getElementById("bill-content").innerHTML;

    // Open a blank window for printing
    const printWindow = window.open("", "_blank", "width=800,height=600");

    // Write the bill content to the new window
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Bill</title>
          <style>
            body { font-family: 'Courier New', monospace; padding: 20px; text-align: center; }
            .bill-content { width: 300px; margin: auto; text-align: left; }
            .bill-header { font-weight: bold; text-align: center; font-size: 16px; }
            .bill-items { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px; }
            .bill-items th, .bill-items td { padding: 5px; border-bottom: 1px solid #ddd; text-align: left; }
            .bill-total { font-weight: bold; font-size: 16px; }
            .bold { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="bill-content">
            ${billContent}
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);

    // Close the document to trigger rendering
    printWindow.document.close();

    // Delay navigation back to previous page by 1 second
    setTimeout(() => {
      navigate(-1);
    }, 1000); // Adjust time as needed to ensure proper navigation
  };

  if (!orderDetails) {
    return <div>Loading... Please wait while we fetch your order details.</div>;
  }

  const discount = 0.1 * orderDetails.totalPrice; // 10% discount
  const netTotal = orderDetails.totalPrice;
  const gst = 0.025 * netTotal; // 2.5% CGST + 2.5% SGST
  const finalTotal = netTotal + gst * 2;

  return (
    <div className="billing-page">
      <div className="billing-box">
        <div id="bill-content" className="bill-content">
          <div className="bill-header">
            <p>Your Restaurant Name</p>
            <p>Address p1</p>
            <p>Address p2</p>
            <p>Tel:xxxxxxxxxx</p>
            <h2>TAX INVOICE</h2>
          </div>
          <p>Date: {currentDateTime} | <b>Table: {orderDetails.table || "N/A"}</b></p>
          <p><b>Guest:</b>XXXXX</p>
          <p><b>Bill No:</b> {orderDetails._id}</p>
          <hr />
          <table className="bill-items">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Rate</th>
                <th>Qty</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.price.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr />
          <p><b>Total:</b> {orderDetails.totalPrice.toFixed(2)} Rs</p>
          <p><b>Net Total:</b> {netTotal.toFixed(2)} Rs</p>
          <p><b>CGST (2.5%):</b> {gst.toFixed(2)} Rs</p>
          <p><b>SGST (2.5%):</b> {gst.toFixed(2)} Rs</p>
          <hr />
          <p className="bold">Sub Total: {finalTotal.toFixed(2)} Rs</p>
          <p><b>GST No:</b> 27AACCF9974F1Z8</p>
          <p><b>HSN Code:</b> 996331</p>
          <h3 className="bill-total">NET TOTAL: {finalTotal.toFixed(2)} Rs</h3>
        </div>
        <button className="bill-print" onClick={handlePrint}>Print Bill</button>
      </div>
    </div>
  );
};

export default BillingPage;
