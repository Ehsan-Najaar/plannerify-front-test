'use client'

import { useStore } from '@/components/context/ClientProvider'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { LOGIN } from '@/data/api'
import { useRequest } from '@/hooks/useRequest'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

export default function Login() {
  const { t } = useTranslation()
  const router = useRouter()
  const { setStore } = useStore()

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loginReq, loginLoader] = useRequest({ url: LOGIN, method: 'POST' })

  const submit = useCallback(() => {
    if (!formData.email || !formData.password) {
      toast.error(t('Please fill in all fields.'))
      return
    }

    loginReq(formData)
      .then((r) => {
        const user = {
          accessToken: r.access_token,
          email: r.email,
          id: r.id,
          firstName: r.firstName,
          lastName: r.lastName,
          role: r.role,
        }
        setStore((prev) => ({ ...prev, user }))
        router.push(user.role === 'user' ? '/dashboard' : '/dashboard/admin')
      })
      .catch((e) => {
        console.error(e)
        toast.error(
          e?.status === 406
            ? t(
                'You account is banned. Please contact support for more information.'
              )
            : t('User information is incorrect.')
        )
      })
  }, [formData, loginReq, setStore, t, router])

  return (
    <div className="flex flex-col text-text mt-10 gap-8 p-6 lg:p-10">
      <div className="flex flex-col gap-6 max-w-[680px] mx-auto">
        <div>
          <h1 className="text-xl font-medium">{t('Login')}</h1>
          <p>{t('Please enter your username and password')}</p>
        </div>

        <div>
          <Input
            type="text"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            label={t('Email')}
          />
          <Input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            label={t('Password')}
            className="mt-2"
            onEnter={submit}
          />
          <button
            className="text-sm text-primary-500 font-medium cursor-pointer"
            onClick={() => router.push('/auth/reset-password')}
          >
            {t('Forgot Password')}
          </button>
        </div>

        <Button
          caption={t('Login')}
          color="primary"
          onClick={submit}
          loading={loginLoader}
        />

        <div>
          {t("Don't have an account?")}{' '}
          <Link
            href="/auth/register"
            className="font-semibold text-primary-500"
          >
            {t('Register')}
          </Link>
        </div>
      </div>
    </div>
  )
}
