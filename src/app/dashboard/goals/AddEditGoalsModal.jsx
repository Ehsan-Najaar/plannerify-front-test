'use client'

import Button, { TextButton } from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { GOAL } from '@/data/api'
import { useRequest } from '@/hooks/useRequest'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaPen, FaTrash } from 'react-icons/fa'
import { toast } from 'react-toastify'
import '../../../../i18n'

export default function AddEditGoalsModal({
  open,
  formInit,
  onClose,
  editMode,
  reload,
  isDark,
}) {
  const { t } = useTranslation()

  const [goalAddEditReq, goalAddEditLoader] = useRequest({
    url: GOAL + (editMode ? `/${editMode.id}` : ``),
    method: editMode ? 'PUT' : 'POST',
  })

  const [form, setForm] = useState(
    formInit || { title: '', description: '', date: '', tasks: [] }
  )
  const [formErr, setFormErr] = useState({ title: '' })

  // مقداردهی اولیه فرم هنگام باز شدن مودال
  useEffect(() => {
    if (open) {
      if (editMode) {
        const tasks =
          editMode.tasks?.length > 0
            ? editMode.tasks.map((t) => ({ ...t, saved: true }))
            : [{ title: '', description: '', completed: false, saved: false }]

        setForm({
          title: editMode.title || '',
          description: editMode.description || '',
          date: editMode.date || '',
          tasks,
        })
      } else {
        setForm(formInit)
      }
    }
  }, [open, editMode])

  // محاسبه درصد پیشرفت بر اساس تسک‌ها
  const calculateProgress = (tasks) => {
    if (!tasks || tasks.length === 0) return 0
    const completedCount = tasks.filter((t) => t.completed).length
    return Math.round((completedCount / tasks.length) * 100)
  }

  // ارسال فرم
  const submitForm = () => {
    let hasErr = false
    let formErrVar = formErr

    if (form.title.trim() === '') {
      formErrVar = { ...formErrVar, title: t('Please specify a title') }
      hasErr = true
    }

    const unsavedIdx = form.tasks.findIndex((t) => !t.saved)
    if (unsavedIdx !== -1) {
      handleSaveTask(unsavedIdx)
      return
    }

    if (hasErr) {
      setFormErr(formErrVar)
      toast.error(t('Please fill all required fields'))
      return
    }

    const cleanedForm = {
      ...form,
      progress: calculateProgress(form.tasks),
      tasks: form.tasks.map(({ title, description, completed }) => ({
        title,
        description,
        completed,
      })),
    }

    console.log('Submitting form', editMode ? 'EDIT' : 'ADD', cleanedForm)

    goalAddEditReq(cleanedForm)
      .then(() => {
        reload?.()
        onClose?.()
        toast.success(
          editMode
            ? t('Goal updated successfully')
            : t('Goal added successfully')
        )
      })
      .catch((err) => {
        console.error('Error saving goal:', err)
        toast.error(t('Something went wrong'))
      })
  }

  // مدیریت تسک‌ها
  const handleSaveTask = (idx) => {
    const updated = [...form.tasks]
    const task = updated[idx]
    if (task.title.trim() === '') {
      toast.error(t('Task Name can not be empty'))
      return
    }
    updated[idx] = { ...task, saved: true }
    setForm({ ...form, tasks: updated })
  }

  const handleEditTask = (idx) => {
    const updated = [...form.tasks]
    updated[idx].saved = false
    setForm({ ...form, tasks: updated })
  }

  const handleDeleteTask = (idx) => {
    const updated = form.tasks.filter((_, i) => i !== idx)
    setForm({ ...form, tasks: updated })
  }

  const shortDesc = (text) =>
    text.length > 50 ? text.substring(0, 50) + '...' : text

  // منطق دکمه Add Task
  const handleAddTask = () => {
    const unsavedIdx = form.tasks.findIndex((t) => !t.saved)
    if (unsavedIdx !== -1) {
      handleSaveTask(unsavedIdx)
      return
    }

    setForm({
      ...form,
      tasks: [
        ...form.tasks,
        { title: '', description: '', completed: false, saved: false },
      ],
    })
    toast.success(t('New task added'))
  }

  return (
    <Modal
      title={t('Add / Edit Goals')}
      icon={'/assets/icons/flag.svg'}
      open={open}
      onClose={onClose}
      maxWidth={600}
      footer={
        <div className="flex gap-2 items-center justify-center">
          <Button
            caption={t('Add')}
            onClick={submitForm}
            loading={goalAddEditLoader}
          />
          <Button
            caption={t('Cancel')}
            outlined
            onClick={onClose}
            className="bg-white"
          />
        </div>
      }
    >
      <div className="flex flex-col gap-8">
        {/* نام هدف */}
        <Input
          label={t('Goal name')}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          onFocus={() => setFormErr({ ...formErr, title: '' })}
          error={formErr.title}
        />

        {/* تاریخ پایان */}
        <Input
          label={t('End Date')}
          type="date"
          value={form.date || ''}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        {/* توضیحات هدف */}
        <Input
          label={t('Description')}
          multiLine
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {/* لیست داینامیک تسک‌ها */}
        <div className="flex flex-col gap-4">
          {form.tasks.map((task, idx) => (
            <div key={idx} className="flex flex-col gap-3">
              {task.saved ? (
                <div className="flex items-center justify-between border-b-2 border-primary pb-2">
                  <div
                    className={`${
                      isDark ? 'text-primary-light' : 'text-primary'
                    } w-1/3 font-semibold text-primary truncate pr-16`}
                  >
                    {task.title}
                  </div>
                  <div
                    className={`w-1/3 px-8 text-sm text-left ${
                      isDark ? 'text-primary-light/50' : 'text-primary/50'
                    } truncate`}
                  >
                    {shortDesc(task.description)}
                  </div>
                  <div className="w-1/3 flex items-center justify-end gap-3 ml-4">
                    <FaPen
                      size={18}
                      className={`${
                        isDark ? 'text-primary-light' : 'text-primary'
                      } hover:text-purple-800 cursor-pointer transition-all duration-300`}
                      onClick={() => handleEditTask(idx)}
                    />
                    {idx > 0 && (
                      <FaTrash
                        size={18}
                        className={`${
                          isDark ? 'text-primary-light' : 'text-primary'
                        } hover:text-purple-800 cursor-pointer transition-all duration-300`}
                        onClick={() => handleDeleteTask(idx)}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <Input
                    label={t(`Task ${idx + 1} Name`)}
                    value={task.title}
                    onChange={(e) => {
                      const updated = [...form.tasks]
                      updated[idx].title = e.target.value
                      setForm({ ...form, tasks: updated })
                    }}
                  />
                  <Input
                    label={t(`Task ${idx + 1} Description`)}
                    multiLine
                    value={task.description}
                    onChange={(e) => {
                      const updated = [...form.tasks]
                      updated[idx].description = e.target.value
                      setForm({ ...form, tasks: updated })
                    }}
                  />
                </div>
              )}
            </div>
          ))}

          {/* دکمه افزودن تسک جدید */}
          <div className="flex mt-2">
            <TextButton
              caption={t('Add Task')}
              outlined
              leftIcon={
                <Plus
                  className={`stroke-4 ${
                    isDark ? 'text-primary-light' : 'text-primary'
                  }`}
                />
              }
              onClick={handleAddTask}
              className={`${isDark ? 'text-primary-light' : 'text-primary'}`}
            />
          </div>
        </div>
      </div>
    </Modal>
  )
}
