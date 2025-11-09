'use client'

import Select from '@/components/Select'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { LANGUAGE } from '@/data/api'
import { useRequest } from '@/hooks/useRequest'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

export default function LanguageModal({ open, onClose, reload }) {
  const { t } = useTranslation()

  const formInit = {
    languageCode: '',
    file: '',
    direction: '',
  }

  const [form, setForm] = useState(formInit)
  const [formErr, setFormErr] = useState(formInit)

  const [languageReq, languageLoader] = useRequest({
    url: LANGUAGE,
    method: 'POST',
  })

  const submitForm = () => {
    let formErr = formInit
    let hasErr = false
    if (!form.languageCode.trim()) {
      formErr.languageCode = t('Please enter a unique language code')
      hasErr = true
    }

    if (!form.file) {
      formErr.file = t('Please select a file.')
      hasErr = true
    }

    if (!form.direction) {
      formErr.direction = t('Please select language direction.')
      hasErr = true
    }

    if (hasErr) {
      setFormErr(formErr)
      return false
    }

    const reader = new FileReader()

    reader.onload = async (event) => {
      try {
        const jsonData = JSON.parse(event.target.result)

        languageReq({
          file: JSON.stringify(jsonData),
          languageCode: form.languageCode,
          direction: form.direction?.value,
        })
          .then((r) => {
            toast.success(t('File uploaded successfully!'))
            reload?.()
            onClose?.()
          })
          .catch((e) => {
            if (e.error === 'DUPLICATE') {
              toast.error(t('Language code is already in use.'))
            } else {
              toast.error(t('File upload failed.'))
            }
          })
      } catch (error) {
        toast.error(t('Invalid JSON file.'))
      }
    }

    reader.readAsText(form.file)
  }

  return (
    <Modal
      title={t('Add New Language')}
      open={open}
      onClose={onClose}
      maxWidth={500}
      footer={
        <div className="flex gap-2 items-center">
          <div className="flex gap-2">
            <Button caption={t('Add')} onClick={submitForm} />

            <Button caption={t('Cancel')} outlined onClick={onClose} />
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        <Input
          label={t('Language Title')}
          placeholder={t('Ex. en, fr, etc.')}
          value={form.languageCode}
          onChange={(e) => setForm({ ...form, languageCode: e.target.value })}
          onFocus={() => setFormErr({ ...formErr, languageCode: '' })}
          error={formErr.languageCode}
        />
        <Input
          type="file"
          label={t('Language File')}
          onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
          onFocus={() => setFormErr({ ...formErr, file: '' })}
          error={formErr.file}
        />
        <Select
          label={t('Language Direction')}
          options={[
            { name: t('Left to Right'), value: 'ltr' },
            { name: t('Right to Left'), value: 'rtl' },
          ]}
          selected={form.direction}
          onChange={(e) => setForm({ ...form, direction: e })}
          onFocus={() => setFormErr({ ...formErr, direction: '' })}
          error={formErr.direction}
          noSearch
        />
      </div>
    </Modal>
  )
}
