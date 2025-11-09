'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const SiteInfoContext = createContext()

export const useSiteInfo = () => {
  const context = useContext(SiteInfoContext)
  if (!context) {
    throw new Error('useSiteInfo must be used within a SiteInfoProvider')
  }
  return context
}

const SiteInfoProvider = ({ children }) => {
  const [siteInfo, setSiteInfo] = useState({
    logoBase64: null,
    siteName: 'My Website',
  })

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/site-info`)
      .then((res) => res.json())
      .then((data) => {
        setSiteInfo({
          logoBase64: data.logoBase64 || null,
          siteName: data.siteName || 'My Website',
        })
      })
      .catch((err) => console.error('Error fetching site info:', err))
  }, [])

  return (
    <SiteInfoContext.Provider value={{ siteInfo, setSiteInfo }}>
      {children}
    </SiteInfoContext.Provider>
  )
}

export default SiteInfoProvider
