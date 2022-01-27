import './App.css'
import 'react-datepicker/dist/react-datepicker.css'
import Register from './components/Register'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import { Route, Routes, Link } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import { useState, useEffect } from 'react'
import AuthRoute from './components/AuthRoute'
import { StatusProvider } from './context/StatusContext'
import axios from 'axios'
import { PlantsProvider } from './context/PlantsContext'

function App() {
  const token = localStorage.getItem('plantsManagerToken')
  const user = useState(token ? JSON.parse(atob(token.split('.')[1])) : null)
  const [statuses, setStatuses] = useState([])
  const [plants, setPlants] = useState([])
  const getStatuses = async () => {
    try {
      const { data } = await axios.get('http://localhost:3300/api/statuses/')
      setStatuses(data)
    } catch (error) {
      console.error('Error getting statuses', error)
      setStatuses([])
    }
  }

  const getPlants = async () => {
    try {
      console.log('user here: ', user)
      const { data } = await axios.get(
        `http://localhost:3300/api/plants/${user[0]?.id}`
      )
      console.log('got data', data)
      setPlants(data)
    } catch (error) {
      console.error('Error getting plants', error)
      setPlants([])
    }
  }
  useEffect(() => {
    getPlants()
    getStatuses()
  }, [])
  return (
    <div className="App">
      <PlantsProvider plants={[plants, setPlants]}>
        <StatusProvider statuses={[statuses, setStatuses]}>
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
        </StatusProvider>
      </PlantsProvider>
    </div>
  )
}

export default App
