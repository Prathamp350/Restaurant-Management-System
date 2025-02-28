// OrderButton.jsx
import React from 'react';
import './orderbutton.css'


const OrderButton = ({ onClick }) => {
  return (
    <div className="order-button">
      <button onClick={onClick}>Submit Order</button>
    </div>
  );
};

export default OrderButton;
