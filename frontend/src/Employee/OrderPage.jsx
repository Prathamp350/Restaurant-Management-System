import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './orderpage.css';

const OrderPage1 = () => {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({ tableOrGuest: '', items: [], status: 'Pending', totalPrice: 0 });
  const [menuItems, setMenuItems] = useState([]);
  const navigate = useNavigate();

  // Fetch orders from the API
  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders');
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchMenuItems();
  }, []);

  // Fetch menu items from the API
  const fetchMenuItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/menus');
      setMenuItems(response.data);
    } catch (err) {
      console.error('Error fetching menu items:', err);
    }
  };

  // Add item to the order
  const handleAddItem = (event) => {
    const selectedItemName = event.target.value;
    const selectedMenuItem = menuItems.find(item => item.name === selectedItemName);

    if (selectedMenuItem && !newOrder.items.some(item => item.name === selectedItemName)) {
      const updatedItems = [
        ...newOrder.items,
        {
          name: selectedItemName,
          price: selectedMenuItem.price,
          quantity: 1,
          menuItemId: selectedMenuItem._id,
        }
      ];
      const updatedTotalPrice = updatedItems.reduce((total, item) => total + item.price * item.quantity, 0);

      setNewOrder((prevOrder) => ({
        ...prevOrder,
        items: updatedItems,
        totalPrice: updatedTotalPrice,
      }));
    }
  };

  // Remove item from the order
  const handleRemoveItem = (itemToRemove) => {
    const updatedItems = newOrder.items.filter(item => item.name !== itemToRemove);
    const updatedTotalPrice = updatedItems.reduce((total, item) => total + item.price * item.quantity, 0);

    setNewOrder((prevOrder) => ({
      ...prevOrder,
      items: updatedItems,
      totalPrice: updatedTotalPrice,
    }));
  };

  // Create new order
  const handleCreateOrder = async (e) => {
    e.preventDefault();

    try {
      const orderData = {
        tableOrGuest: newOrder.tableOrGuest,
        items: newOrder.items,
        totalPrice: newOrder.totalPrice,
        status: newOrder.status,
      };

      const response = await axios.post('http://localhost:5000/api/orders', orderData);

      if (response.status === 200) {
        // Clear the form after submitting
        setNewOrder({ tableOrGuest: '', items: [], status: 'Pending', totalPrice: 0 });
        fetchOrders();
      }
    } catch (err) {
      console.error('Error creating order:', err);
    }
  };

  // Handle completing the order and navigating to the billing page
  const handleCompleteOrder = async (orderId, orderItems) => {
    try {
      // First, update the order status to "Completed"
      await axios.put(`http://localhost:5000/api/orders/${orderId}`, { status: 'Completed' });

      // After updating the status, navigate to the billing page with order details
      navigate(`/employee-dashboard/billing`, { state: { orderId, orderItems } });
      
      // Optionally, refresh the order list to reflect the status change
      fetchOrders();
    } catch (err) {
      console.error('Error completing order:', err);
    }
  };

  // Filter orders to show only those with 'Pending' status
  const pendingOrders = orders.filter((order) => order.status === 'Pending');

  return (
    <div className="order-page">
      {/* Create New Order Form */}
      <form onSubmit={handleCreateOrder}>
        <input
          type="text"
          placeholder="Table Number or Guest Name"
          value={newOrder.tableOrGuest}
          onChange={(e) => setNewOrder({ ...newOrder, tableOrGuest: e.target.value })}
          required
        />
        
        {/* Menu Item Selector as Dropdown */}
        <h3>Select Menu Items</h3>
        <select onChange={handleAddItem} defaultValue="">
          <option value="" disabled>Select a menu item</option>
          {menuItems.map((item) => (
            <option key={item._id} value={item.name}>
              {item.name} - {item.price}rs
            </option>
          ))}
        </select>

        {/* List of Items Added to the Order */}
        <h3>Added Items</h3>
        <div className="added-items">
          {newOrder.items.map((item, index) => (
            <div key={index} className="added-item">
              <span>{item.name} - {item.price}rs</span>
              <button 
                type="button" 
                onClick={() => handleRemoveItem(item.name)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Display Total Price */}
        <h3>Total Price: {newOrder.totalPrice}rs</h3>

        <select
          value={newOrder.status}
          onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value })}
        >
          <option value="Pending">Pending</option>
        </select>
        <button type="submit">Create Order</button>
      </form>

      {/* Display Pending Orders */}
      <h2>Pending Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Table/Guest</th>
            <th>Menu Items</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingOrders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.tableOrGuest}</td>
              <td>{order.items.map(item => item.name).join(', ')}</td>
              <td>{order.status}</td>
              <td>
                <button onClick={() => handleCompleteOrder(order._id, order.items)}>Complete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderPage1;
