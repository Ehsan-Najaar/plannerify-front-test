'use client'

import StoreProvider, { useStore } from '@/components/context/ClientProvider'
import { useSiteInfo } from '@/components/context/SiteInfoContext'
import Loader from '@/components/Loader'
import { LANGUAGE } from '@/data/api'
import i18next from 'i18next'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { initReactI18next } from 'react-i18next'
import { ToastContainer } from 'react-toastify'

function AuthLayout({ children }) {
  const { setStore } = useStore()
  const { siteInfo } = useSiteInfo()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initLanguage = async () => {
      try {
        const lang = localStorage.getItem('lang') || 'en'
        const res = await fetch(`${LANGUAGE}/${lang}`, { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to fetch language')

        const data = await res.json()
        if (!data || !data.file) {
          setLoading(false)
          return
        }

        // راه‌اندازی i18next
        await i18next.use(initReactI18next).init({
          resources: { [lang]: { translation: JSON.parse(data.file) } },
          lng: lang,
          fallbackLng: 'en',
          interpolation: { escapeValue: false },
        })

        // تنظیم جهت و زبان HTML
        document.documentElement.lang = lang
        document.documentElement.dir = data.direction === 'rtl' ? 'rtl' : 'ltr'
      } catch (error) {
        console.error('Language init failed:', error)
      } finally {
        setLoading(false)
      }
    }

    initLanguage()

    // هدایت به داشبورد اگر کاربر لاگین کرده باشد
    if (sessionStorage.getItem('user')) {
      router.push('/dashboard')
    }
  }, [router, setStore])

  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <Loader size={40} />
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-center mt-10">
        {siteInfo.logoBase64 ? (
          <img
            src={siteInfo.logoBase64}
            alt={siteInfo.siteName}
            width={100}
            height={100}
            className="object-contain"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-300 rounded-md" />
        )}
      </div>

      <div className="mx-auto w-fit rounded-2xl md:bg-background-dark md:shadow-lg">
        {children}
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </>
  )
}

export default function AuthLayoutWithStoreProvider({ children }) {
  return (
    <StoreProvider>
      <AuthLayout>{children}</AuthLayout>
    </StoreProvider>
  )
}
