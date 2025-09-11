import { useState } from 'react'
import { Route, Routes, Link } from 'react-router-dom'

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/auth/Login'
import AppLayout from './layouts/AppLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import UserRegister from './pages/user/CreateUser'
import UserList from './pages/user/ListUsers'

function App() {

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login/>}/>

        <Route element={<ProtectedRoute />}>
          <Route path="/application" element={<AppLayout/>}>
            <Route path="home" element={<h1>Home</h1>}/>
            <Route path="user" element={<UserRegister/>}/>
            <Route path="users" element={<UserList/>}/>
            <Route path="reports" element={<h1>Reports</h1>}/>
          </Route>
        </Route>

        
      </Routes>
    </>
  )
}

export default App
