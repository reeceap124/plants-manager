import React, { createContext, useContext } from 'react'

const StatusContext = createContext([])

export function useStatus() {
  return useContext(StatusContext)
}

export function StatusProvider({ statuses, children }) {
  const addStatuses = () => {
    console.error(
      'Unable to add new statuses at this time. \nRefer to StatusContext.js'
    )
  }
  return (
    <StatusContext.Provider value={[statuses[0], addStatuses]}>
      {children}
    </StatusContext.Provider>
  )
}
