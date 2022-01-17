import React from 'react'
import { Navigate } from 'react-router-dom'

export default function AuthRoute({ children }) {
  const token = localStorage.getItem('plantsManagerToken')
  if (
    !token ||
    new Date().getTime() < parseInt(JSON.parse(atob(token.split('.')[1])).exp)
  ) {
    console.log(
      'expiration',
      parseInt(JSON.parse(atob(token.split('.')[1])).exp),
      new Date().getTime() <
        parseInt(JSON.parse(atob(token.split('.')[1])).exp),
      '\ntoken',
      token
    )
    return <Navigate to="/login" replace />
  } else {
    return <>{children}</>
  }
}
