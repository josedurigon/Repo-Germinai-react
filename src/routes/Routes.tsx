import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Login from '../pages/auth/Login';
import Homepage from '../pages/auth/Homepage';
import UserRegister from '../pages/user/CreateUser';
import UserList from '../pages/user/ListUsers';
import AppLayout from '../layouts/AppLayout';
import ProtectedRoute from './ProtectedRoute';
import AboutUs from '../components/AboutUs/AboutUs';


const AppRoutes: React.FC = () => {
  return (
    <Routes>

      <Route path="/" element={<Homepage />} />
      <Route path='/sobre-nos' element={<AboutUs />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/application" element={<AppLayout />}>
          <Route path="home" element={<h1>Home</h1>} />
          <Route path="user" element={<UserRegister />} />
          <Route path="users" element={<UserList />} />
          <Route path="reports" element={<h1>Reports</h1>} />

        </Route>
      </Route>

      <Route path="*" element={<h1>Página Não Encontrada (404)</h1>} />

    </Routes>
  );
};

export default AppRoutes;