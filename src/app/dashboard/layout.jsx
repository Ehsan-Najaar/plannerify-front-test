'use client'

import StoreProvider, { useStore } from '@/components/context/ClientProvider'
import Loader from '@/components/Loader'
import MobileHeader from '@/components/MobileHeader'
import Sidebar from '@/components/sidebar'
import SidebarAdmin from '@/components/sidebar-admin'
import { LANGUAGE, ME } from '@/data/api'
import i18next from 'i18next'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { initReactI18next } from 'react-i18next'
import { ToastContainer } from 'react-toastify'

function DashboardLayout({ children }) {
  const { store, setStore } = useStore()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [languageLoading, setLanguageLoading] = useState(true)

  useEffect(() => {
    const loadLanguage = async () => {
      const lang = localStorage.getItem('lang') || 'en'
      try {
        const res = await fetch(`${LANGUAGE}/${lang}`)
        const data = await res.json()

        if (Object.keys(data).length > 0) {
          i18next.use(initReactI18next).init({
            resources: { [lang]: { translation: JSON.parse(data.file) } },
            lng: lang,
            fallbackLng: 'en',
            interpolation: { escapeValue: false },
          })

          document.documentElement.setAttribute(
            'dir',
            data.direction === 'rtl' ? 'rtl' : 'ltr'
          )
          document.documentElement.setAttribute('lang', lang)
        }
      } catch (err) {
        console.error('Language load error:', err)
      } finally {
        setLanguageLoading(false)
      }
    }

    loadLanguage()

    const loadTheme = () => {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme === 'dark') document.documentElement.classList.add('dark')
      else document.documentElement.classList.add('light')
    }
    loadTheme()

    const fetchUser = async () => {
      try {
        const res = await fetch(ME, {
          credentials: 'include',
        })
        if (!res.ok) throw new Error('Not authenticated')
        const data = await res.json()
        setStore((prev) => ({ ...prev, user: data.user }))
      } catch (err) {
        setStore((prev) => ({ ...prev, user: undefined }))
        router.replace('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()

    setStore((prev) => ({
      ...prev,
      collapsed: localStorage.getItem('collapsed') === 'true',
    }))
  }, [setStore, router])

  if (languageLoading || loading) {
    return (
      <div className="flex w-screen h-screen items-center justify-center">
        <Loader size={40} />
      </div>
    )
  }

  return (
    <div
      className={`grid grid-cols-1 ${
        store.collapsed
          ? 'lg:grid-cols-[60px_auto]'
          : 'lg:grid-cols-[240px_auto]'
      } h-screen`}
    >
      {/* Sidebar بر اساس نقش کاربر */}
      {store.user?.role === 'user' && <Sidebar />}
      {(store.user?.role === 'admin' || store.user?.role === 'super-admin') && (
        <SidebarAdmin />
      )}

      <div className="h-screen overflow-auto p-4">
        <MobileHeader />
        <div className="mt-16 lg:mt-0">{children}</div>
      </div>

      <ToastContainer />
    </div>
  )
}

const LayoutWithStoreProvider = ({ children }) => (
  <StoreProvider>
    <DashboardLayout>{children}</DashboardLayout>
  </StoreProvider>
)

export default LayoutWithStoreProvider
