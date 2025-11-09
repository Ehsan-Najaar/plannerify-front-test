'use client'

import Button, { TextButton } from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaPen, FaTrash } from 'react-icons/fa'
import { toast } from 'react-toastify'
import '../../../i18n'

export default function GoalTasksModal({
  open,
  onClose,
  goal,
  onSave,
  isDark,
}) {
  const { t } = useTranslation()
  const [tasks, setTasks] = useState([])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (goal) {
      setTasks(goal.tasks?.map((t) => ({ ...t, saved: true })) || [])
    }
  }, [goal])

  useEffect(() => {
    if (tasks.length > 0) {
      const completedCount = tasks.filter((t) => t.completed).length
      setProgress(Math.round((completedCount / tasks.length) * 100))
    } else {
      setProgress(0)
    }
  }, [tasks])

  const handleAddTask = () => {
    const unsavedIdx = tasks.findIndex((t) => !t.saved)
    if (unsavedIdx !== -1) {
      handleSaveTask(unsavedIdx)
      return
    }
    setTasks([
      ...tasks,
      { title: '', description: '', saved: false, completed: false },
    ])
  }

  const handleSaveTask = (idx) => {
    const updated = [...tasks]
    if (updated[idx].title.trim() === '') return
    updated[idx] = { ...updated[idx], saved: true }
    setTasks(updated)
  }

  const handleEditTask = (idx) => {
    const updated = [...tasks]
    updated[idx].saved = false
    setTasks(updated)
  }

  const handleDeleteTask = (idx) => {
    const updated = tasks.filter((_, i) => i !== idx)
    setTasks(updated)
  }

  const toggleCompleted = (idx) => {
    const updated = [...tasks]
    updated[idx].completed = !updated[idx].completed
    setTasks(updated)
  }

  // ✅ چک می‌کنیم آیا همه‌ی تسک‌ها عنوان دارند
  const canSave = useMemo(() => {
    if (tasks.length === 0) return false
    return tasks.every((t) => t.title.trim() !== '')
  }, [tasks])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('Goal Tasks')}
      icon={'/assets/icons/flag.svg'}
      maxWidth={500}
      footer={
        <div className="flex justify-center gap-2">
          <Button
            caption={t('Save')}
            onClick={() => {
              const hasInvalid = tasks.some((t) => !t.title.trim())

              if (hasInvalid) {
                toast.error(t('Task Name can not be empty'))
                return
              }

              onSave(tasks, progress)
            }}
          />
          <Button caption={t('Cancel')} outlined onClick={onClose} />
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {tasks.map((task, idx) => (
          <div key={idx} className="flex flex-col gap-3">
            {task.saved ? (
              <div className="flex items-center justify-between border-b-2 border-primary pb-2">
                <div className="flex items-center gap-2 w-1/2">
                  <Checkbox
                    value={task.completed}
                    onChange={() => toggleCompleted(idx)}
                  />
                  <span className="font-semibold text-primary truncate">
                    {task.title}
                  </span>
                </div>
                <div className="flex items-center gap-3">
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
              <div className="space-y-3">
                <Input
                  label={t(`Task ${idx + 1} Name`)}
                  value={task.title}
                  onChange={(e) => {
                    const updated = [...tasks]
                    updated[idx].title = e.target.value
                    setTasks(updated)
                  }}
                />
                <Input
                  label={t(`Task ${idx + 1} Description`)}
                  multiLine
                  value={task.description}
                  onChange={(e) => {
                    const updated = [...tasks]
                    updated[idx].description = e.target.value
                    setTasks(updated)
                  }}
                />
                <div className="flex items-center gap-2">
                  <Checkbox
                    value={task.completed}
                    onChange={() => toggleCompleted(idx)}
                  />
                  <span>{t('Completed')}</span>
                </div>
              </div>
            )}
          </div>
        ))}

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
            onClick={() => {
              const hasInvalid = tasks.some((t) => !t.title.trim())

              if (hasInvalid) {
                toast.error(t('Task Name can not be empty'))
                return
              }

              handleAddTask()
            }}
            className={`${isDark ? 'text-primary-light' : 'text-primary'}`}
          />
        </div>

        <div className="flex items-center gap-4 mt-4 w-full">
          <div
            className="w-full h-5 rounded-full bg-gray-200 overflow-hidden"
            style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }}
          >
            <div
              className="h-full bg-linear-to-r from-primary to-primary-light rounded-full transition-all duration-500 ease-in-out"
              style={{
                width: `${progress}%`,
              }}
            ></div>
          </div>
          <p className="w-11 text-center">{progress}%</p>
        </div>
      </div>
    </Modal>
  )
}
