import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

export default function Login() {
  let navigate = useNavigate()
  const defaultCreds = { email: '', password: '' }
  const [credentials, setCredentials] = useState(defaultCreds)
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
    <Form onSubmit={submit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          name="email"
          onChange={handleChange}
        />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleChange}
        />
        <Form.Text className="text-muted">
          Please make it different from your bank login. We've done our best to
          make sure this stays secure, but this is a hobby project...
        </Form.Text>
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  )
}
