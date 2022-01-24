import React, { createContext, useContext } from 'react'

const PlantsContext = createContext([])

export function usePlants() {
  return useContext(PlantsContext)
}

export function PlantsProvider({ plants, children }) {
  return (
    <PlantsContext.Provider value={plants}>{children}</PlantsContext.Provider>
  )
}
