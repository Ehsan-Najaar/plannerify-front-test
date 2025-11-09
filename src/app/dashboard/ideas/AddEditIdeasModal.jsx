'use client'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { IDEA } from '@/data/api'
import { useRequest } from '@/hooks/useRequest'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function AddEditIdeasModal({ open, onClose, editMode, reload }) {
  const { t } = useTranslation()

  const [ideaAddEditReq, ideaAddEditLoader] = useRequest({
    url: IDEA + (editMode ? `/${editMode.id}` : ``),
    method: editMode ? 'PUT' : 'POST',
  })

  const formInit = {
    title: '',
    description: '',
  }

  const [form, setForm] = useState(formInit)

  const [formErr, setFormErr] = useState({
    title: '',
  })

  useEffect(() => {
    if (open) {
      if (editMode) {
        setForm({
          title: editMode.title,
          description: editMode.description,
        })
      } else {
        setForm(formInit)
      }
    }
  }, [open])

  const submitForm = () => {
    let hasErr = false
    let formErrVar = formErr
    if (form.title.trim() === '') {
      formErrVar = { ...formErrVar, title: t('Please specify a title') }
      hasErr = true
    }

    if (hasErr) {
      setFormErr(formErrVar)
      return false
    }

    ideaAddEditReq({ ...form }).then((r) => {
      reload?.()
      onClose?.()
    })
  }

  return (
    <Modal
      title={t('Add /Edit Ideas')}
      open={open}
      onClose={onClose}
      maxWidth={500}
      footer={
        <div className="flex gap-2 items-center justify-end">
          <Button
            caption={t('Save')}
            onClick={submitForm}
            loading={ideaAddEditLoader}
          />

          <Button caption={t('Cancel')} outlined onClick={onClose} />
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        <Input
          label={t('Title')}
          placeholder={t('Enter idea title')}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          onFocus={() => setFormErr({ ...formErr, title: '' })}
          error={formErr.title}
        />
        <Input
          label={t('Description')}
          multiLine
          placeholder={t('Enter idea description')}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>
    </Modal>
  )
}
