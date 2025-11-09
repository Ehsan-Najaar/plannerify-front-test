'use client'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { GET_CODE_FOR_EMAIL, USER } from '@/data/api'
import { useRequest } from '@/hooks/useRequest'
import { validateEmail } from '@/utils/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

export default function Register() {
  const { t } = useTranslation()
  const [stage, setStage] = useState(1)
  const router = useRouter()

  const [formDataErr, setFormDataErr] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    password2: '',
    code: '',
  })

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    password2: '',
    code: '',
  })

  const [registerReq, registerLoader] = useRequest({
    url: GET_CODE_FOR_EMAIL,
    method: 'POST',
  })

  const registerHandle = () => {
    let hasErr = false
    let tempErrObj = { ...formDataErr }
    if (formData.firstName.trim() === '') {
      hasErr = true
      tempErrObj.firstName = t('Please specify your first name')
    }
    if (formData.lastName.trim() === '') {
      hasErr = true
      tempErrObj.lastName = t('Please specify your last name')
    }
    if (formData.email.trim() === '') {
      hasErr = true
      tempErrObj.email = t('Please specify your email address')
    } else if (!validateEmail(formData.email.trim())) {
      hasErr = true
      tempErrObj.email = t('The email address is invalid')
    }
    if (formData.password.trim() === '') {
      hasErr = true
      tempErrObj.password = t('Please specify a password')
    }
    if (formData.password !== formData.password2) {
      hasErr = true
      tempErrObj.password2 = t('Passwords does not match')
    }
    if (hasErr) {
      setFormDataErr(tempErrObj)
      return false
    }
    let formDataClean = { ...formData }
    delete formDataClean.password2

    registerReq({
      mobile: formDataClean.mobile,
      email: formDataClean.email,
    })
      .then(() => {
        setStage(2)
      })
      .catch((e) => {
        if (e?.status === 409) {
          if (e?.error === 'EMAIL') {
            toast.error(t('Email has been already registered.'))
          }
        }
      })
  }
  const [registerCodeReq, registerCodeLoader] = useRequest({
    url: USER,
    method: 'POST',
  })

  const sendCodeHandle = () => {
    let formDataClean = { ...formData }
    delete formDataClean.password2

    registerCodeReq({ ...formDataClean })
      .then(() => {
        toast.success(t('You have been registered successfully'))
        router.push('/auth/login')
      })
      .catch((e) => {
        if (e?.status === 409) {
          if (e?.error === 'EMAIL') {
            toast.error(t('Email has been already registered.'))
          } else {
            toast.error(
              t('The code is already has been sent. Please try 2 min later')
            )
          }
        } else {
          if (e?.error === 'BAD_CODE') {
            setFormDataErr({
              ...formDataErr,
              code: t('The code is not correct'),
            })
          } else {
            toast.error(t('Register was not successfull. Please try again.'))
          }
        }
      })
  }

  return (
    <div className="flex flex-col text-text mt-10 gap-8 p-6 lg:p-10 ">
      <div className="flex flex-col gap-6 max-w-[680px] mx-auto ">
        <div>
          <h1 className="text-xl font-medium">{t('Create an account')}</h1>
          <p>
            {t(
              'Please enter your information and verify your code that has been sent to your Email'
            )}
          </p>
        </div>
        {stage === 1 ? (
          <>
            <div className="flex md:flex-row flex-col gap-2">
              <Input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                label={t('First Name')}
                className="flex-1"
                error={formDataErr.firstName}
                onFocus={() =>
                  setFormDataErr({ ...formDataErr, firstName: '' })
                }
              />
              <Input
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                label={t('Last Name')}
                className="flex-1"
                error={formDataErr.lastName}
                onFocus={() => setFormDataErr({ ...formDataErr, lastName: '' })}
              />
            </div>

            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              label={t('Email')}
              className="flex-1"
              error={formDataErr.email}
              onFocus={() => setFormDataErr({ ...formDataErr, email: '' })}
            />
            <div className="flex md:flex-row flex-col gap-2">
              <Input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                label={t('Password')}
                className="flex-1"
                error={formDataErr.password}
                onFocus={() => setFormDataErr({ ...formDataErr, password: '' })}
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
            <div>
              {t('By clicking on continue, you accept our')}{' '}
              <Link className="text-blue-600! underline" href="/terms">
                {t('Terms of use')}
              </Link>
            </div>
            <Button
              caption={t('Continue')}
              color="primary"
              onClick={registerHandle}
              loading={registerLoader}
            />
            <div>
              {t('Already have an account?')}{' '}
              <Link
                href="/auth/login"
                className="font-semibold text-primary-500"
              >
                {t('Login')}
              </Link>
            </div>
          </>
        ) : (
          <div>
            <Input
              type="tel"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              label={t('Code')}
              className="mt-2"
              error={formDataErr.code}
              onFocus={() => setFormDataErr({ ...formDataErr, code: '' })}
            />
            <div className="mt-6 flex gap-2">
              <Button
                caption={t('Register')}
                color="primary"
                onClick={sendCodeHandle}
                loading={registerCodeLoader}
              />
              <Button
                caption={t('Back')}
                outlined
                onClick={() => setStage(1)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
