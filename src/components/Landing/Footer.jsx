'use client'

import { useSiteInfo } from '@/components/context/SiteInfoContext'
import Button from '@/components/ui/Button'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'

export default function Footer({ socials }) {
  const { t } = useTranslation()
  const { siteInfo } = useSiteInfo()

  return (
    <div className="mt-20 divide-y divide-white/20">
      <div className="flex justify-between lg:items-center text-white py-6 flex-col lg:flex-row">
        <div className="flex gap-3 items-center">
          {siteInfo.logoBase64 ? (
            <Image
              src={siteInfo.logoBase64}
              alt={siteInfo.siteName || 'Logo'}
              width={60}
              height={60}
            />
          ) : (
            <div className="w-12 h-12 bg-gray-300 rounded-md" />
          )}

          <div>
            {siteInfo.siteName && (
              <h3 className="text-lg font-medium">{siteInfo.siteName}</h3>
            )}
            <p className="mt-1 text-sm">
              {t('Visualize product ideas fast and easy with AI')}
            </p>
          </div>
        </div>
        <Button
          caption={t('Sign Up for free')}
          href="/dashboard"
          className="mt-10 lg:mt-0 w-full lg:w-auto"
        />
      </div>
      <div>
        <div className="text-white my-4">{t('Follow us on Social Media')}</div>
        <div className="flex gap-1 items-center">
          {socials?.map((it) => (
            <a
              key={it.id}
              href={it.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block  gap-2 hover:opacity-80 transition-opacity"
              aria-label={it.name}
              title={it.name}
            >
              <img
                src={it.logoBase64}
                alt={it.name}
                className="h-8 w-8 object-contain rounded border border-transparent"
                loading="lazy"
                decoding="async"
              />
              <span className="text-sm">{it.name}</span>
            </a>
          ))}
        </div>
      </div>
      <div className="text-white text-xs text-center p-4">
        {t('2024 © Uizard Technologies. All rights reserved.')}
      </div>
      <div></div>
    </div>
  )
}
