'use client'

import { useSiteInfo } from '@/components/context/SiteInfoContext'
import Button from '@/components/ui/Button'
import { CloseCircle, HambergerMenu } from 'iconsax-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const MenuItem = ({ caption, href }) => (
  <li>
    <Link
      href={href}
      className="font-semibold text-sm transition-all hover:text-primary-dark text-white"
    >
      {caption}
    </Link>
  </li>
)
export default function LandingHeader() {
  const [show, setShow] = useState(false)
  const { t } = useTranslation()
  const { siteInfo } = useSiteInfo()

  return (
    <>
      <div className="flex items-center justify-between -mx-6 p-2 sticky top-0 backdrop-blur-lg z-10 lg:hidden">
        <div className="flex items-center gap-2">
          <button onClick={() => setShow(true)}>
            <HambergerMenu size={20} color="white" />
          </button>
          {siteInfo.logoBase64 ? (
            <Image
              src={siteInfo.logoBase64}
              width={24}
              height={24}
              className="w-12"
              alt={siteInfo.siteName}
            />
          ) : (
            <div className="w-12 h-12 bg-gray-300 rounded-md" />
          )}

          <h1 className="text-xl font-medium">{siteInfo.siteName}</h1>
        </div>
        <ul className="flex gap-6">
          <li>
            <Button
              size="small"
              caption={t('Register')}
              href="/auth/register"
            />
          </li>
        </ul>
      </div>
      <div
        className={`transition-all duration-300 w-screen lg:w-full flex-col lg:flex-row gap-10 lg:gap-1 p-10 lg:p-0 bg-black lg:bg-transparent flex lg:items-center justify-between lg:h-16 backdrop-blur-lg bg-opacity-95 top-0 z-10 fixed lg:sticky inset-0 overflow-auto lg:overflow-hidden ${
          show ? 'left-0' : 'left-[-100vw]'
        }`}
      >
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            {siteInfo.logoBase64 ? (
              <Image
                src={siteInfo.logoBase64}
                width={24}
                height={24}
                className="w-12"
                alt={siteInfo.siteName}
              />
            ) : (
              <div className="w-12 h-12 bg-gray-300 rounded-md" />
            )}

            <h1 className="text-xl font-medium">{siteInfo.siteName}</h1>
          </div>
          <button onClick={() => setShow(false)} className="lg:hidden">
            <CloseCircle size={20} color="white" />
          </button>
        </div>
        <ul className="flex-col lg:flex-row flex gap-4 lg:gap-10">
          <MenuItem caption={t('Home')} href="/" />
          <MenuItem caption={t('Dashboard')} href="/dashboard" />
          <MenuItem caption={t('Pricing')} href="/#pricing" />
          <MenuItem caption={t('About Us')} href="about" />
        </ul>
        <ul className="flex-col lg:flex-row flex lg:items-center gap-6">
          <MenuItem caption={t('Login')} href="/auth/login" />
          <li>
            <Button
              size="small"
              caption={t('Register')}
              href="/auth/register"
            />
          </li>
        </ul>
      </div>
    </>
  )
}
