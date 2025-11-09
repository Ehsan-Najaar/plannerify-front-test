'use client'

import ConfirmationModal from '@/components/ConfirmationModal'
import Select from '@/components/Select'
import Button, { TextButton } from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { TASK } from '@/data/api'
import { useRequest } from '@/hooks/useRequest'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

export default function AddEditTasksModal({
  open,
  onClose,
  editMode,
  currentDate,
  data,
  reload,
}) {
  const { t } = useTranslation()

  const [taskAddEditReq, taskAddEditLoader] = useRequest({
    url: TASK + (editMode ? `/${editMode.id}` : ``),
    method: editMode ? 'PUT' : 'POST',
  })

  const [taskDeleteReq, taskDeleteLoader] = useRequest({
    url: TASK,
    method: 'DELETE',
  })

  const priorityOptions = [
    { name: 'Low', value: 1 },
    { name: 'Medium', value: 2 },
    { name: 'High', value: 3 },
  ]

  const formInit = {
    title: '',
    description: '',
    time: '',
    all: false,
    notification: false,
    date: currentDate,
    sort: data?.length || 0,
    priority: priorityOptions[0],
  }

  const [form, setForm] = useState(formInit)
  const [formErr, setFormErr] = useState({
    title: '',
    time: '',
  })

  useEffect(() => {
    if (open) {
      if (editMode) {
        setForm({
          title: editMode.title,
          description: editMode.description,
          time: editMode.time,
          all: false,
          notification: editMode.notification,
          date: editMode.date,
          sort: editMode.sort,
          priority: priorityOptions.find(
            (item) => item.value === editMode.priority
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

    if (!form.title?.trim()) {
      formErrVar = { ...formErrVar, title: t('Please specify a title') }
      hasErr = true
    }

    if (!form.date) {
      formErrVar = { ...formErrVar, date: t('Please select a date') }
      hasErr = true
    }

    if (hasErr) {
      setFormErr(formErrVar)
      return false
    }

    const mDate = moment(form.date)

    const weekday = mDate.format('dddd')
    const month = mDate.format('MMM') // Nov, Dec, etc.
    const year = mDate.year()

    console.log('Form data before sending:', {
      ...form,
      weekday,
      month,
      year,
      priority: form.priority?.value,
    })

    taskAddEditReq({
      ...form,
      weekday,
      month,
      year,
      priority: form.priority?.value,
    })
      .then((r) => {
        console.log('Backend response:', r)
        reload?.()
        onClose?.()
      })
      .catch((err) => {
        console.error('Error from backend:', err)
        toast.error(t('An error occurred. Please try later.'))
      })
  }

  const deleteTask = () => {
    return taskDeleteReq({ id: editMode.id })
      .then((r) => {
        onClose()
        reload()
      })
      .catch((e) => toast.error(t('There was an error. Please try again.')))
  }

  return (
    <Modal
      title={t('Add /Edit Tasks')}
      open={open}
      onClose={onClose}
      maxWidth={500}
      footer={
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            {editMode && (
              <ConfirmationModal
                title={t('Delete Task')}
                message={t('Do you want to delete this task?')}
                yesCaption={t('Delete')}
                noCaption={t('Cancel')}
                confirmHandle={deleteTask}
                loading={taskDeleteLoader}
              >
                <TextButton
                  caption={t('Delete Task')}
                  className="text-red-700 underline"
                />
              </ConfirmationModal>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              caption={t('Save')}
              onClick={submitForm}
              loading={taskAddEditLoader}
            />

            <Button caption={t('Cancel')} outlined onClick={onClose} />
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        <Input
          label={t('Task Name')}
          placeholder={t('Enter task name')}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          onFocus={() => setFormErr({ ...formErr, title: '' })}
          error={formErr.title}
        />
        <Input
          label={t('Description')}
          multiLine
          placeholder={t('Enter task description')}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <Input
          label={t('Time')}
          type="time"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
          onFocus={() => setFormErr({ ...formErr, time: '' })}
          error={formErr.time}
        />
        <Select
          options={priorityOptions}
          noSearch
          label={t('Priority')}
          selected={form.priority}
          onChange={(e) => setForm({ ...form, priority: e })}
        />
        <div>
          <Checkbox
            label={t('Set for all')}
            value={form.all}
            onChange={(e) => setForm({ ...form, all: e })}
          />
          <Checkbox
            label={t('Notification')}
            value={form.notification}
            onChange={(e) => setForm({ ...form, notification: e })}
          />
        </div>
      </div>
    </Modal>
  )
}
