import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  let navigate = useNavigate()
  const defaultCreds = { email: '', password: '' }
  const [credentials, setCredentials] = useState(defaultCreds)
  const [showPassword, setShowPassword] = useState(false)
  const handleChange = (e) =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(
        'http://localhost:3300/api/auth/login',
        credentials
      )
      if (data.status === 'success') {
        setCredentials(defaultCreds)
        localStorage.setItem('plantsManagerToken', data.token)
        navigate('/dashboard', { replace: true })
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <form onSubmit={submit}>
      <label>
        Email:
        <input
          type="email"
          name="email"
          onChange={handleChange}
          value={credentials.email}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          name="password"
          onChange={handleChange}
          value={credentials.password}
        />
      </label>
      <button type="submit">Login</button>
    </form>
  )
}
