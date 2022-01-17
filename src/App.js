import './App.css'
import Register from './components/Register'
import Login from './components/Login'
import { Route, Routes, Link } from 'react-router-dom'
import { UserContext } from './context/UserContext'
import { useState, useEffect } from 'react'
import AuthRoute from './components/AuthRoute'

function App() {
  const user = useState(null)
  return (
    <div className="App">
      <div>Hello {user[0]?.username}</div>
      <UserContext.Provider value={user}>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>

        <Routes>
          <Route
            exact
            path="/dashboard"
            element={
              <AuthRoute>
                <div>dashboard</div>
              </AuthRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </UserContext.Provider>
    </div>
  )
}

export default App
