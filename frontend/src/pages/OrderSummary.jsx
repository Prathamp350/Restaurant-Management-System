// OrderSummary.jsx
import React from 'react';
import './ordersummary.css'

const OrderSummary = ({ orderItems, totalCost }) => {
  return (
    <div className="order-summary">
      <h3>Order Summary</h3>
      <ul>
        {orderItems.map(item => (
          <li key={item.id}>
            {item.name} - ${item.price}
          </li>
        ))}
      </ul>
      <h4>Total: ${totalCost}</h4>
    </div>
  );
};

export default OrderSummary;
