import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ManageUsers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: '' });
  const [editUser, setEditUser] = useState(null);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch users initially
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle create user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users', newUser);
      // Refresh the list after creating the user
      fetchUsers(); 
      refreshStats();
      setNewUser({ username: '', password: '', role: '' }); // Reset new user form
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setEditUser(user);
  };

  // Handle update user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/users/${editUser._id}`, editUser);
      // Refresh the list after updating the user
      fetchUsers(); 
      setEditUser(null); // Clear the edit form
      refreshStats();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      // Refresh the list after deleting the user
      fetchUsers(); 
      refreshStats();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="manage-users">
      <h1>Manage Employee</h1>

      <form onSubmit={editUser ? handleUpdateUser : handleCreateUser}>
        <input
          type="text"
          placeholder="Username"
          value={editUser ? editUser.username : newUser.username}
          onChange={(e) => (editUser ? setEditUser({ ...editUser, username: e.target.value }) : setNewUser({ ...newUser, username: e.target.value }))} 
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={editUser ? editUser.password : newUser.password}
          onChange={(e) => (editUser ? setEditUser({ ...editUser, password: e.target.value }) : setNewUser({ ...newUser, password: e.target.value }))} 
          required
        />
        <select
          value={editUser ? editUser.role : newUser.role}
          onChange={(e) => (editUser ? setEditUser({ ...editUser, role: e.target.value }) : setNewUser({ ...newUser, role: e.target.value }))} 
          required
        >
          <option value="">Select</option>
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>

        </select>
        <button type="submit">{editUser ? 'Update Employee' : 'Create Employee'}</button>
      </form>

      <div className="user-list">
        <h2>Employee List</h2>
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleEditUser(user)}>Edit</button>
                  <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
