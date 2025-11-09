'use client'

import Select from '@/components/Select'
import { useStore } from '@/components/context/ClientProvider'
import { useTheme } from '@/components/context/ThemeContext'
import Button from '@/components/ui/Button'
import { LANGUAGE } from '@/data/api'
import { useRequest } from '@/hooks/useRequest'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import '../../../../i18n'

export default function Settings() {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useTheme()
  const { store } = useStore()

  const [languageReq] = useRequest({
    url: LANGUAGE,
    method: 'GET',
  })

  const [isSavingLogo, setIsSavingLogo] = useState(false)
  const [siteName, setSiteName] = useState('')

  const [language, setLanguage] = useState('')
  const [languageList, setLanguageList] = useState([])

  // وضعیت لوگو
  const [logo, setLogo] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)

  useEffect(() => {
    languageReq()
      .then((r) => {
        setLanguageList(r)
        setLanguage({
          name: i18n.language || t('Default (EN)'),
          value: i18n.language || 'en',
        })
      })
      .catch(() => {
        toast.error(t('An error occurred. Please refresh the page.'))
      })
  }, [])

  const themeOptions = [
    { name: t('Light'), value: 'light' },
    { name: t('Dark'), value: 'dark' },
  ]

  const saveNewLanguage = (lang) => {
    localStorage.setItem('lang', lang.value)
    location.reload()
  }

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (err) => reject(err)
    })

  const handleLogoChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error(t('Please select an image file.'))
      return
    }
    const base64 = await fileToBase64(file)
    setLogo(base64)
    setLogoPreview(URL.createObjectURL(file))
  }

  const handleSaveLogo = async () => {
    if (!logo || !siteName) {
      toast.error(
        t('Please select a logo and enter the site name before saving.')
      )
      return
    }

    setIsSavingLogo(true)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/settings/logo`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ logoBase64: logo, siteName }),
        }
      )

      if (!res.ok) throw new Error()
      toast.success(t('Logo updated successfully!'))
    } catch {
      toast.error(t('An error occurred while updating logo.'))
    } finally {
      setIsSavingLogo(false)
    }
  }

  return (
    <div>
      <div className="pb-4 border-b border-solid border-slate-500/40 mb-4">
        <h1 className="text-lg font-semibold text-text">{t('Settings')}</h1>
      </div>

      <div className="grid grid-cols-2 bg-card text-text rounded-md shadow-sm p-8 max-w-[900px] mx-auto items-center gap-4">
        {/* زبان */}
        <div>{t('Language')}</div>
        <div>
          <Select
            options={languageList.map((language) => ({
              name: language.languageCode,
              value: language.languageCode,
            }))}
            selected={language}
            onChange={(e) => {
              setLanguage(e)
              saveNewLanguage(e)
            }}
            noSearch
          />
        </div>

        {/* تم */}
        <div>{t('Theme')}</div>
        <div>
          <Select
            options={themeOptions}
            selected={themeOptions.find((o) => o.value === theme)}
            onChange={(e) => setTheme(e.value)}
            noSearch
          />
        </div>

        {/* لوگو و siteName فقط برای ادمین */}
        {(store.user?.role === 'admin' ||
          store.user?.role === 'super-admin') && (
          <>
            <div>{t('Logo & Site')}</div>
            <div className="flex items-center gap-4">
              {/* مربع انتخاب لوگو */}
              <label
                htmlFor="logoInput"
                className="w-24 h-24 border border-dashed border-slate-400 rounded-md flex items-center justify-center cursor-pointer hover:border-primary transition-all"
              >
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Preview"
                    className="w-full h-full object-contain rounded-md"
                  />
                ) : (
                  <span className="text-sm text-slate-500">
                    {t('Select Logo')}
                  </span>
                )}
                <input
                  id="logoInput"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </label>

              {/* فیلد نام سایت */}
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-2/4 border-b border-border  p-2 text-text text-sm focus:outline-none"
                placeholder={t('Enter site name')}
              />

              {/* دکمه ذخیره */}
              <Button
                caption={isSavingLogo ? t('Saving...') : t('Save')}
                disabled={isSavingLogo}
                onClick={handleSaveLogo}
                size={'small'}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
