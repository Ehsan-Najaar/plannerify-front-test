'use client'

import HomePageClientSide from '@/components/HomePageClientSide'
import { LANGUAGE } from '@/data/api'
import i18next from 'i18next'
import { useEffect, useState } from 'react'
import { initReactI18next } from 'react-i18next'

const initI18n = (lang, translations) => {
  // if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    resources: { [lang]: { translation: translations } },
    lng: lang,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })
  // }
}

export default function HomePageLanguage({ data, subscriptions, socials }) {
  const [languageLoading, setLanguageLoading] = useState(true)

  useEffect(() => {
    const loadLanguage = async () => {
      const lang = localStorage.getItem('lang') || 'en'
      const res = await fetch(`${LANGUAGE}/${lang}`)
      const data = await res.json()

      if (Object.keys(data).length === 0) {
        setLanguageLoading(false)
        return
      }

      initI18n(lang, JSON.parse(data.file))

      document.documentElement.setAttribute(
        'dir',
        data.direction === 'rtl' ? 'rtl' : 'ltr'
      )
      document.documentElement.setAttribute('lang', lang)

      setLanguageLoading(false)
    }

    loadLanguage()
  }, [])

  return languageLoading ? (
    <HomePageClientSide
      data={data}
      subscriptions={subscriptions}
      socials={socials?.items}
    />
  ) : (
    <HomePageClientSide
      data={data}
      subscriptions={subscriptions}
      socials={socials?.items}
    />
  )
}
