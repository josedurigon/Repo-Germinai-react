import { useState } from 'react'
import { Route, Routes, Link, Navigate } from 'react-router-dom'

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/auth/Login'
import AppLayout from './layouts/AppLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import UserRegister from './pages/user/CreateUser'
import UserList from './pages/user/ListUsers'
import CreateSafra from './pages/safra/CreateSafra'
import CreateSafraSimple from './pages/safra/CreateSafraSimple'
import ListSafras from './pages/safra/ListSafras'
import Dashboard from './pages/Dashboard'
import Homepage from './pages/auth/Homepage'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login/>}/>
        <Route path="/homepage" element={<Homepage/>}/>

        <Route element={<ProtectedRoute />}>
          <Route path="/application" element={<AppLayout/>}>
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<Dashboard/>}/>
            <Route path="user" element={<UserRegister/>}/>
            <Route path="users" element={<UserList/>}/>
            <Route path="safras" element={<ListSafras/>}/>
            <Route path="safra/criar" element={<CreateSafra/>}/>
            <Route path="atividades" element={<h1>Atividades</h1>}/>
            <Route path="custos" element={<h1>Custos</h1>}/>
            <Route path="estoque" element={<h1>Estoque</h1>}/>
            <Route path="reports" element={<h1>Reports</h1>}/>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  )
}

export default App
