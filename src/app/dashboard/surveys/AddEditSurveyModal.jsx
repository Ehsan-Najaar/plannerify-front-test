'use client'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { SURVEY } from '@/data/api'
import { useRequest } from '@/hooks/useRequest'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function AddEditSurveyModal({
  open,
  category,
  onClose,
  editMode,
  reload,
}) {
  const { t } = useTranslation()

  const [surveyAddEditReq, surveyAddEditLoader] = useRequest({
    url: SURVEY + (editMode ? `/${editMode.id}` : ``),
    method: editMode ? 'PUT' : 'POST',
  })

  const formInit = {
    name: '',
    description: '',
    priority: 0,
    category,
  }

  const [form, setForm] = useState(formInit)
  const [formErr, setFormErr] = useState({
    name: '',
    description: '',
  })

  useEffect(() => {
    if (open) {
      if (editMode) {
        setForm({
          name: editMode.name,
          description: editMode.description,
          priority: editMode.priority,
          category: editMode.category,
        })
      } else {
        setForm(formInit)
      }
    }
  }, [open])

  const submitForm = () => {
    let hasErr = false
    let formErrVar = formErr
    if (form.name.trim() === '') {
      formErrVar = { ...formErrVar, name: t('Please specify a title') }
      hasErr = true
    }

    if (form.description.trim() === '') {
      formErrVar = {
        ...formErrVar,
        description: t('Please specify a description'),
      }
      hasErr = true
    }

    if (hasErr) {
      setFormErr(formErrVar)
      return false
    }

    surveyAddEditReq(form).then((r) => {
      reload?.()
      onClose?.()
    })
  }

  return (
    <Modal
      title={t('Add / View Surveys')}
      open={open}
      onClose={onClose}
      maxWidth={500}
      footer={
        <div className="flex gap-2 items-center">
          <div className="flex gap-2">
            {!editMode && (
              <Button
                caption={t('Send')}
                onClick={submitForm}
                loading={surveyAddEditLoader}
              />
            )}
            <Button caption={t('Cancel')} outlined onClick={onClose} />
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        <Input
          label={t('Survey Title')}
          placeholder={t('Enter survey title')}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          onFocus={() => setFormErr({ ...formErr, name: '' })}
          error={formErr.name}
          disabled={editMode}
        />
        <Input
          label={t('Description')}
          multiLine
          placeholder={t('Enter survey description')}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          onFocus={() => setFormErr({ ...formErr, description: '' })}
          error={formErr.description}
          disabled={editMode}
        />
        <label className="mt-4">{t('Priority')}</label>
        <input
          type="range"
          min="0"
          max="100"
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value * 1 })}
          disabled={editMode}
        />
        {editMode?.answer && (
          <div className="mt-4 bg-slate-100 rounded-md p-4">
            <h1>{t('Admin Answer')}</h1>
            <div>{editMode.answer}</div>
          </div>
        )}
      </div>
    </Modal>
  )
}
