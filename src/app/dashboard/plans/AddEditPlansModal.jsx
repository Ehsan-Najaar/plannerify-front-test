'use client'

import ConfirmationModal from '@/components/ConfirmationModal'
import Select from '@/components/Select'
import Button, { TextButton } from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { PLAN } from '@/data/api'
import { useRequest } from '@/hooks/useRequest'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import '../../../../i18n'

export default function AddEditPlansModal({
  open,
  onClose,
  editMode,
  currentCategory,
  reload,
}) {
  const { t } = useTranslation()

  const [planAddEditReq, planAddEditLoader] = useRequest({
    url: PLAN + (editMode ? `/${editMode.id}` : ``),
    method: editMode ? 'PUT' : 'POST',
  })

  const [planDeleteReq, planDeleteLoader] = useRequest({
    url: PLAN,
    method: 'DELETE',
  })

  const priorityOptions = [
    { name: t('Low'), code: 3 },
    { name: t('Medium'), code: 2 },
    { name: t('High'), code: 1 },
  ]

  const categoryOptions = [
    { name: t('Work'), code: 'work' },
    { name: t('Study'), code: 'study' },
    { name: t('Gym'), code: 'gym' },
  ]

  const formInit = {
    title: '',
    description: '',
    dueDate: null,
    priority: priorityOptions.find((option) => option.code === 3),
    category: categoryOptions.find(
      (category) => category.code === currentCategory
    ),
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
          dueDate: editMode.dueDate,
          category: categoryOptions.find(
            (category) => editMode.category === category.code
          ),
          priority: priorityOptions.find(
            (priority) => editMode.priority === priority.code
          ),
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
    let primitivData = form
    primitivData.priority = form.priority.code
    primitivData.category = form.category.code

    planAddEditReq(primitivData).then((r) => {
      reload?.()
      onClose?.()
    })
  }

  const deletePlan = () => {
    return planDeleteReq({ id: editMode.id })
      .then((r) => {
        onClose()
        reload()
      })
      .catch((e) => toast.error(t('There was an error. Please try again.')))
  }

  return (
    <Modal
      title={t('Add /Edit Plans')}
      open={open}
      onClose={onClose}
      maxWidth={500}
      footer={
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            {editMode && (
              <ConfirmationModal
                title={t('Delete Plan')}
                message={t('Do you want to delete this plan?')}
                yesCaption={t('Delete')}
                noCaption={t('Cancel')}
                confirmHandle={deletePlan}
                loading={planDeleteLoader}
              >
                <TextButton
                  caption={t('Delete Plane')}
                  className="text-red-700 underline"
                />
              </ConfirmationModal>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              caption={t('Save')}
              onClick={submitForm}
              loading={planAddEditLoader}
            />

            <Button caption={t('Cancel')} outlined onClick={onClose} />
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        <Input
          label={t('Title')}
          placeholder={t('Enter plan title')}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          onFocus={() => setFormErr({ ...formErr, title: '' })}
          error={formErr.title}
        />
        <Input
          label={t('Description')}
          multiLine
          placeholder={t('Enter plan description')}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <Input
          label={t('Due Date')}
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        />
        <Select
          options={priorityOptions}
          noSearch
          label={t('Priority')}
          selected={form.priority}
          onChange={(e) => setForm({ ...form, priority: e })}
        />

        <Select
          options={categoryOptions}
          noSearch
          label={t('Category')}
          selected={form.category}
          onChange={(e) => setForm({ ...form, category: e })}
        />
      </div>
    </Modal>
  )
}
