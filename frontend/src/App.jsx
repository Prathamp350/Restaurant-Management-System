import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import EmployeeDashboard from './Employee/EmployeeDashboard';
import Reservation from './pages/Reservation';
import ManageUsers from './pages/ManageUsers';
import OrderPage from './pages/OrderPage';
import OrderPage1 from './Employee/OrderPage';
import CheckReservation from "./pages/CheckReservation";
import MenuPage from './pages/MenuPage';
import UpdateMenuPage from './pages/UpdateMenuPage';
import BillingPage from './pages/BillingPage'; // Import Billing Page
import Home from './pages/Home';
import SalesReport from './pages/Sales-report';





const App = () => {
  const [menu, setMenu] = useState({
    
  });

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<Login />} />

        {/* Admin Dashboard with Nested Routes */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route path="users" element={<ManageUsers />} />
          <Route path="reservation" element={<Reservation />} />
          <Route path="check-reservations" element={<CheckReservation />} />
          <Route path="order" element={<OrderPage menu={menu} />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="menu" element={<MenuPage menu={menu} setMenu={setMenu} />} />
          <Route path="update-menu" element={<UpdateMenuPage />} />
          <Route path="home" element={<Home />} />
          <Route path="sales-report" element={<SalesReport />} />
        </Route>

        {/* Employee Dashboard */}
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} >
        <Route path="order" element={<OrderPage1 menu={menu} />} />
        <Route path="reservation" element={<Reservation />} />
        <Route path="check-reservations" element={<CheckReservation />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="menu" element={<MenuPage menu={menu} setMenu={setMenu} />} />
        <Route path="home" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
