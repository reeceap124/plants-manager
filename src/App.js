import './App.css'
import Register from './components/Register'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import { Route, Routes, Link } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import { useState } from 'react'
import AuthRoute from './components/AuthRoute'

function App() {
  const token = localStorage.getItem('plantsManagerToken')
  const user = useState(token ? JSON.parse(atob(token.split('.')[1])) : null)
  return (
    <div className="App">
      <UserProvider user={user}>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>

        <Routes>
          <Route
            exact
            path="/dashboard"
            element={
              <AuthRoute>
                <Dashboard />
              </AuthRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </UserProvider>
    </div>
  )
}

export default App
