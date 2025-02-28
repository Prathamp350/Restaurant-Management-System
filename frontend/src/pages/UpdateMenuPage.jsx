import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/updatemenupage.css'

const UpdateMenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch existing menu items for editing
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        // Update existing menu item
        await axios.put(`http://localhost:5000/api/menus/${selectedItemId}`, formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Sending JWT token in header
          }
        });
        alert("Menu item updated successfully");
      } else {
        // Add new menu item
        await axios.post('http://localhost:5000/api/menus', formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Sending JWT token in header
          }
        });
        alert("Menu item added successfully");
      }

      // Reset form and state
      setFormData({ name: '', description: '', price: '', category: '' });
      setIsEditMode(false);
      // Re-fetch menu items after submitting
      const response = await axios.get('http://localhost:5000/api/menus');
      setMenuItems(response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleEditItem = (item) => {
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category
    });
    setIsEditMode(true);
    setSelectedItemId(item._id);
  };

  // Group items by category
  const groupedMenuItems = menuItems.reduce((groups, item) => {
    const category = item.category || 'Other'; // Default to 'Other' if no category
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});

  if (loading) return <p>Loading menu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="update-menu">
      <h1>Update Menu</h1>

      {/* Menu Item Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Item Name"
          required
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Item Description"
          
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          required
        />
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          required
        />
        <button type="submit">{isEditMode ? "Update Item" : "Add Item"}</button>
      </form>

      <h1>Existing Menu Items</h1>
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {groupedMenuItems[category].map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>₹{item.price}</td>
                  <td>
                    <button onClick={() => handleEditItem(item)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default UpdateMenuPage;
