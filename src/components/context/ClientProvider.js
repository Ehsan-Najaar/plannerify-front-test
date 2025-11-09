'use client'

import { createContext, useContext, useState } from 'react'

const Store = createContext()

export const useStore = () => {
  const context = useContext(Store)
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}

// Context Provider
const StoreProvider = ({ children }) => {
  const [store, setStore] = useState({})

  return <Store.Provider value={{ store, setStore }}>{children}</Store.Provider>
}

export default StoreProvider
