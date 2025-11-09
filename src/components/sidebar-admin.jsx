'use client'

import { useStore } from '@/components/context/ClientProvider'
import { useSiteInfo } from '@/components/context/SiteInfoContext'
import { MenuItem } from '@/components/sidebar'
import { LOGOUT } from '@/data/api'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Document,
  Home,
  Instagram,
  LanguageSquare,
  Logout,
  Paperclip,
  Ruler,
  Setting2,
  Task,
  User,
} from 'iconsax-react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import '../../i18n';
import { toast } from 'react-toastify'

export default function SidebarAdmin() {
  const router = useRouter()
  const pathname = usePathname()
  const { store, setStore } = useStore()
  const { siteInfo } = useSiteInfo()
  const { t } = useTranslation()

  const logout = async () => {
    try {
      const res = await fetch(LOGOUT, {
        method: 'POST',
        credentials: 'include',
      })

      if (!res.ok) throw new Error('Logout failed')

      toast.success('You have been logged out.')
      router.push('/auth/login')
    } catch (err) {
      console.error('Logout error:', err)
      toast.error('Failed to log out. Please try again.')
    }
  }

  return (
    <>
      <div
        className={`bg-card shadow-md shadow-primary h-screen fixed lg:static z-20 transition-all overflow-auto ${
          store.collapsed ? 'p-2 items-center' : 'p-4'
        } ${store.sidebar ? 'left-0' : 'left-[-300px]'} flex flex-col`}
      >
        <div className="flex gap-2 items-center text-primary mt-4">
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

        <ul className="mt-10 flex-1">
          <MenuItem
            caption={t('Home')}
            href="/dashboard/admin"
            icon={<Home />}
            selected={pathname === '/dashboard/admin'}
            collapsed={store.collapsed}
          />
          <MenuItem
            caption={t('Users')}
            href="/dashboard/admin/users"
            icon={<User />}
            selected={pathname === '/dashboard/admin/users'}
            collapsed={store.collapsed}
          />
          <MenuItem
            caption={t('Subscriptions')}
            href="/dashboard/admin/subscriptions"
            icon={<Check />}
            selected={pathname === '/dashboard/admin/subscriptions'}
            collapsed={store.collapsed}
          />
          <MenuItem
            caption={t('Surveys')}
            href="/dashboard/admin/surveys"
            icon={<Task />}
            selected={pathname === '/dashboard/admin/surveys'}
            collapsed={store.collapsed}
          />
          <MenuItem
            caption={t('Content')}
            href="/dashboard/admin/content"
            icon={<Document />}
            selected={pathname === '/dashboard/admin/content'}
            collapsed={store.collapsed}
          />
          <MenuItem
            caption={t('Languages')}
            href="/dashboard/admin/languages"
            icon={<LanguageSquare />}
            selected={pathname === '/dashboard/admin/languages'}
            collapsed={store.collapsed}
          />
          <MenuItem
            caption={t('Social Media')}
            href="/dashboard/admin/social"
            icon={<Instagram />}
            selected={pathname === '/dashboard/admin/social'}
            collapsed={store.collapsed}
          />
          <MenuItem
            caption={t('About Page')}
            href="/dashboard/admin/about-page"
            icon={<Paperclip />}
            selected={pathname === '/dashboard/admin/about-page'}
            collapsed={store.collapsed}
          />
          <MenuItem
            caption={t('Terms Page')}
            href="/dashboard/admin/terms-page"
            icon={<Ruler />}
            selected={pathname === '/dashboard/admin/terms-page'}
            collapsed={store.collapsed}
          />
          <MenuItem
            caption={t('Collapse Menu')}
            onClick={() => {
              localStorage.setItem('collapsed', !store.collapsed)
              setStore({ ...store, collapsed: !store.collapsed })
            }}
            icon={store.collapsed ? <ArrowRight /> : <ArrowLeft />}
            collapsed={store.collapsed}
          />
        </ul>
        <a className="flex gap-2 items-center rounded-full p-2 bg-slate-500 bg-opacity-10 transition-all cursor-pointer">
          <div
            className={`${
              store.collapsed ? 'w-8 min-w-8 h-8' : 'w-12 min-w-12 h-12'
            } overflow-hidden rounded-full`}
          >
            <Image
              src="/assets/images/user-default.png"
              alt="user"
              width={72}
              height={72}
              className="w-full h-full object-cover"
            />
          </div>
          {!store.collapsed && (
            <div className="flex-1 overflow-hidden">
              <h2 className="font-medium text-ellipsis overflow-hidden text-text">
                {store.user
                  ? store.user.firstName + ' ' + store.user.lastName
                  : '...'}
              </h2>
              <p className="text-sm text-ellipsis text-text opacity-70 overflow-hidden">
                {store.user?.email || '...'}
              </p>
            </div>
          )}
        </a>
        <ul className="mt-6">
          <MenuItem
            caption={t('Settings')}
            icon={<Setting2 />}
            href="/dashboard/settings"
            selected={pathname === '/dashboard/settings'}
            collapsed={store.collapsed}
          />
          <MenuItem
            caption={t('Logout')}
            href="#"
            icon={<Logout />}
            onClick={logout}
            collapsed={store.collapsed}
          />
        </ul>
      </div>
      <div
        onClick={() => setStore({ ...store, sidebar: false })}
        className={`fixed bg-black bg-opacity-20 inset-0 z-10 block lg:hidden transition-all ${
          store.sidebar ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      ></div>
    </>
  )
}
