'use client'

import { useStore } from '@/components/context/ClientProvider'
import { useSiteInfo } from '@/components/context/SiteInfoContext'
import { LOGOUT } from '@/data/api'
import {
  ArrowLeft,
  ArrowRight,
  BookSquare,
  Calendar,
  Home,
  LampOn,
  Logout,
  PenAdd,
  Setting2,
  SmsSearch,
  Task,
  TickCircle,
} from 'iconsax-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cloneElement } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

export const MenuItem = ({
  caption,
  href,
  icon,
  selected,
  onClick,
  collapsed,
}) => {
  const enhancedIcon = icon
    ? cloneElement(icon, {
        size: 24,
        color: 'var(--text)',
        variant: 'Bold',
      })
    : null

  const { store, setStore } = useStore()

  return (
    <li
      className={` rounded-full transition-all relative group ${
        selected ? 'bg-primary/15' : 'hover:bg-white/10'
      }`}
    >
      <Link
        href={href || '#'}
        onClick={(e) => {
          setStore({ ...store, sidebar: false })
          if (onClick) {
            e.preventDefault()
            onClick()
          }
        }}
        className={`py-3 px-4 flex items-center gap-2 font-medium ${
          selected ? 'text-text-selected' : 'text-text'
        }`}
      >
        <div>{enhancedIcon}</div>
        {!collapsed && <span>{caption}</span>}
      </Link>
      {store.collapsed && (
        <div className="whitespace-nowrap opacity-0 invisible -translate-x-1 group-hover:opacity-100 group-hover:visible group-hover:translate-x-0 transition-all absolute bg-contrast text-text-reverse text-sm font-medium px-2 py-1 rounded-md z-10 left-14 top-3">
          {caption}
        </div>
      )}
    </li>
  )
}

export default function Sidebar() {
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
        <Link href={'/'} className="flex gap-2 items-center text-primary mt-4">
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
        </Link>
        <ul className="mt-10 flex-1">
          <MenuItem
            caption={t('Home')}
            href="/dashboard"
            icon={<Home />}
            selected={pathname === '/dashboard'}
            collapsed={store.collapsed}
          />
          <MenuItem
            caption={t('Tasks')}
            href="/dashboard/tasks"
            icon={<Task />}
            selected={pathname === '/dashboard/tasks'}
            collapsed={store.collapsed}
          />
          <MenuItem
            caption={t('Ideas')}
            href="/dashboard/ideas"
            icon={<LampOn />}
            selected={pathname === '/dashboard/ideas'}
            collapsed={store.collapsed}
          />
          <MenuItem
            caption={t('Goals')}
            href="/dashboard/goals"
            icon={<BookSquare />}
            selected={pathname === '/dashboard/goals'}
            collapsed={store.collapsed}
          />
          <MenuItem
            caption={t('Plans')}
            href="/dashboard/plans"
            icon={<PenAdd />}
            selected={pathname === '/dashboard/plans'}
            collapsed={store.collapsed}
          />
          <MenuItem
            caption={t('Calendar')}
            href="/dashboard/calendar"
            icon={<Calendar />}
            selected={pathname === '/dashboard/calendar'}
            collapsed={store.collapsed}
          />
          <MenuItem
            caption={t('Surveys')}
            href="/dashboard/surveys"
            icon={<SmsSearch />}
            selected={pathname === '/dashboard/surveys'}
            collapsed={store.collapsed}
          />
          <MenuItem
            caption={t('Go Premium')}
            href="/dashboard/go-premium"
            selected={pathname === '/dashboard/go-premium'}
            icon={<TickCircle />}
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
        <a className="flex gap-2 items-center rounded-full p-2 bg-slate-500/10 transition-all cursor-pointer">
          <div
            className={`${
              store.collapsed ? 'w-8 min-w-8 h-8' : 'w-12 min-w-12 h-12'
            } overflow-hidden rounded-full`}
          >
            <img
              src="/assets/images/user-default.png"
              alt="user"
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
