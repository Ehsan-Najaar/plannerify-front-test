'use client'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { PASSWORD_RECOVERY } from '@/data/api'
import { useRequest } from '@/hooks/useRequest'
import { validateEmail } from '@/utils/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import '../../../../i18n'

export default function ResetPassword() {
  const { t } = useTranslation()
  const [stage, setStage] = useState(1)

  const [formData, setFormData] = useState({
    email: '',
    code: '',
    password: '',
    password2: '',
  })

  const [formDataErr, setFormDataErr] = useState({
    email: '',
    code: '',
    password: '',
    password2: '',
  })

  const [passwordRecoveryReq, passwordRecoveryLoader] = useRequest({
    url: PASSWORD_RECOVERY,
    method: 'POST',
  })
  const router = useRouter()

  const passwordRecoveryHandle = () => {
    let emailError = ''
    if (formData.email.trim() === '') {
      emailError = t('Please specify your email address')
    } else if (!validateEmail(formData.email.trim())) {
      emailError = t('The email address is invalid')
    }
    if (emailError) {
      setFormDataErr({ ...formDataErr, email: emailError })
      return false
    }
    passwordRecoveryReq({ email: formData.email })
      .then(() => {
        setStage(2)
      })
      .catch((e) => {
        if (e?.status === 404) {
          setFormDataErr((prev) => ({ ...prev, email: t('Email not found') }))
        } else {
          toast.error(
            t('Password recovery was not successful. Please try again')
          )
        }
      })
  }
  const passwordRecoveryResetHandle = () => {
    let hasErr = false
    let tempErrObj = { ...formDataErr }
    if (formData.password.trim() === '') {
      hasErr = true
      tempErrObj.password = t('Please specify a password')
    }
    if (formData.password !== formData.password2) {
      hasErr = true
      tempErrObj.password2 = t('Passwords do not match')
    }
    if (hasErr) {
      setFormDataErr(tempErrObj)
      return false
    }
    passwordRecoveryReq({
      email: formData.email,
      code: formData.code,
      password: formData.password,
    })
      .then(() => {
        toast.success(t('Password reset successfully. Please login.'))
        router.push('/auth/login')
      })
      .catch((e) => {
        if (e?.status === 400) {
          setFormDataErr({
            ...formDataErr,
            code: t('The code is not correct'),
          })
        } else {
          toast.error(
            t('Password recovery was not successful. Please try again')
          )
        }
      })
  }

  return (
    <div className="flex flex-col text-text mt-10 gap-8 p-6 lg:p-10 ">
      <div className="flex flex-col gap-6 max-w-[680px] mx-auto ">
        <div>
          <h1 className="text-xl font-medium">{t('Reset Password')}</h1>
          {stage === 1 && <p>{t('Please enter your email and continue')}</p>}
        </div>
        {stage === 1 ? (
          <>
            <div>
              <Input
                type="text"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                label={t('Email')}
                error={formDataErr.email}
                onFocus={() => setFormDataErr({ ...formDataErr, email: '' })}
              />
            </div>
            <Button
              caption={t('Continue')}
              color="primary"
              onClick={passwordRecoveryHandle}
              loading={passwordRecoveryLoader}
            />
          </>
        ) : (
          <>
            <div>
              <Input
                type="text"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                label={t('Code')}
                error={formDataErr.code}
                onFocus={() => setFormDataErr({ ...formDataErr, code: '' })}
              />
              <div className="flex md:flex-row flex-col gap-2 mt-2">
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  label={t('Password')}
                  className="flex-1"
                  error={formDataErr.password}
                  onFocus={() =>
                    setFormDataErr({ ...formDataErr, password: '' })
                  }
                />
                <Input
                  type="password"
                  value={formData.password2 || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, password2: e.target.value })
                  }
                  label={t('Confirm Password')}
                  className="flex-1"
                  error={formDataErr.password2}
                  onFocus={() =>
                    setFormDataErr({ ...formDataErr, password2: '' })
                  }
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                caption={t('Reset Password')}
                color="primary"
                onClick={passwordRecoveryResetHandle}
                loading={passwordRecoveryLoader}
                className="flex-1"
              />
              <Button
                caption={t('Back')}
                outlined
                onClick={() => setStage(1)}
                className="flex-1"
              />
            </div>
          </>
        )}
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
