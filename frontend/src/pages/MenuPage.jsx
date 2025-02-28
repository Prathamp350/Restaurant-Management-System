import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './menupage.css'

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the menu items when the component mounts
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/menus');
        setMenuItems(response.data); // Set menu items to state
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch menu items');
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  if (loading) return <p>Loading menu...</p>;
  if (error) return <p>{error}</p>;

  // Group menu items by category
  const groupedMenuItems = menuItems.reduce((groups, item) => {
    const category = item.category || 'Other'; // Default to 'Other' if no category
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});

  return (
    <div className="menu-page">
      <h1>Menu</h1>

      {/* Render items grouped by category */}
      {Object.keys(groupedMenuItems).map((category) => (
        <div key={category} className="category-section">
          <h2>{category}</h2>
          <table className="menu-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Description</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {groupedMenuItems[category].map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>₹{item.price}</td>
                
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default MenuPage;
