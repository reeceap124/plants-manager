import React, { createContext, useContext } from 'react'

const MediumContext = createContext([])

export function useMediums() {
  return useContext(MediumContext)
}

export function MediumProvider({ mediums, children }) {
  return (
    <MediumContext.Provider value={mediums || []}>
      {children}
    </MediumContext.Provider>
  )
}
