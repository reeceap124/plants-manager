import React from 'react'
import { Navigate } from 'react-router-dom'

export default function AuthRoute({ children }) {
  const token = localStorage.getItem('plantsManagerToken')
  if (
    !token ||
    new Date() >
      new Date(parseInt(JSON.parse(atob(token.split('.')[1])).exp) * 1000)
  ) {
    return <Navigate to="/login" replace />
  } else {
    return <>{children}</>
  }
}
