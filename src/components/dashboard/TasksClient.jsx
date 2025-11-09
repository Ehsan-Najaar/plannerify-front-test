'use client'

import AddEditTasksModal from '@/app/dashboard/tasks/AddEditTasksModal'
import ConfirmationModal from '@/components/ConfirmationModal'
import Checkbox from '@/components/ui/Checkbox'
import WeekNavigator from '@/components/WeekNavigator'
import { TASK_BY_DATE, TASK_DONE_TOGGLE } from '@/data/api'
import { useRequest } from '@/hooks/useRequest'
import { Add, Edit2, Trash } from 'iconsax-react'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import '../../../i18n'

import { toast } from 'react-toastify'

function WeekCard({ date, tasks, createTask, editTask, onDeleteAll }) {
  const { t } = useTranslation()
  const [doneTasks, setDoneTasks] = useState([])

  useEffect(() => {
    setDoneTasks(tasks.map((task) => ({ id: task.id, done: task.done })))
  }, [tasks])

  const [doneReq] = useRequest({ url: TASK_DONE_TOGGLE, method: 'PATCH' })

  const doneToggle = (id) => {
    doneReq({ id })
      .then(() => console.log('Task toggled'))
      .catch(() => toast.error(t('An error occurred. Please try later.')))
  }

  return (
    <div className="bg-primary-light p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-black first-letter:uppercase">
          {t(moment(date).format('dddd'))}
        </h1>
        <div className="flex items-center gap-1">
          <button onClick={() => createTask(date)}>
            <Add color="#333" size={24} />
          </button>
          <ConfirmationModal
            title={t('Deleting all day tasks')}
            message={t('Are you sure you want to delete all tasks of the day?')}
            confirmHandle={() => onDeleteAll(date)}
            yesCaption={t('Delete')}
            noCaption={t('Cancel')}
          >
            <button>
              <Trash color="red" size={20} />
            </button>
          </ConfirmationModal>
        </div>
      </div>

      <ul className="mt-4 flex flex-col gap-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`flex items-center gap-3 bg-white/40 p-2 rounded-md border-s-4 border-solid ${
              task.priority === 3
                ? 'border-red-600'
                : task.priority === 2
                ? 'border-yellow-600'
                : 'border-green-600'
            }`}
          >
            <div className="flex gap-1 items-center">
              <Checkbox
                type="checkbox"
                value={doneTasks.find((t) => t.id === task.id)?.done}
                onChange={(e) => {
                  setDoneTasks((prev) =>
                    prev.map((t) => (t.id === task.id ? { ...t, done: e } : t))
                  )
                  doneToggle(task.id)
                }}
              />
              <button onClick={() => editTask(task.id)}>
                <Edit2 variant="Bulk" size={20} color="#333" />
              </button>
            </div>
            <span
              className={`flex-1 text-[#333] line-clamp-1 ${
                doneTasks.some((t) => t.id === task.id && t.done)
                  ? 'line-through'
                  : ''
              }`}
            >
              {task.title}
            </span>
            <span className="text-xs text-[#333]/60">{task.time}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function TasksClient({ initialTasks }) {
  const { t } = useTranslation()
  const [currentWeek, setCurrentWeek] = useState(moment())
  const [taskModalShow, setTaskModalShow] = useState(false)
  const [editMode, setEditMode] = useState(null)
  const [tasks, setTasks] = useState(initialTasks || [])
  console.log('initialTasks', initialTasks)

  const [getTasksReq] = useRequest({ url: TASK_BY_DATE, method: 'GET' })
  const [deleteTasksReq] = useRequest({ url: TASK_BY_DATE, method: 'DELETE' })

  const getTasks = () => {
    getTasksReq({
      startDate: moment(currentWeek).startOf('isoWeek').format('YYYY-MM-DD'),
      endDate: moment(currentWeek).endOf('isoWeek').format('YYYY-MM-DD'),
    }).then((r) => setTasks(r))
  }

  const deleteAllTaskHandle = (date) => {
    deleteTasksReq({ startDate: date, endDate: date })
      .then(() => {
        setTasks((prev) => prev.filter((task) => task.date !== date))
        toast.success(
          t('All tasks for the day have been deleted successfully.')
        )
      })
      .catch(() => {
        toast.error(
          t('An error occurred while deleting tasks. Please try again.')
        )
      })
  }

  useEffect(() => {
    if (currentWeek) getTasks()
  }, [currentWeek])

  const startOfWeek = moment(currentWeek).startOf('isoWeek')
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD')
  )

  return (
    <div>
      <WeekNavigator {...{ currentWeek, setCurrentWeek }} />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 items-start">
        {weekDays.map((date) => (
          <WeekCard
            key={date}
            date={date}
            tasks={tasks
              .filter((task) => moment(task.date).format('YYYY-MM-DD') === date)
              .sort(
                (a, b) =>
                  parseInt(a.time.replace(':', '')) -
                  parseInt(b.time.replace(':', ''))
              )}
            createTask={(currentDate) => {
              setEditMode(null)
              setTaskModalShow(currentDate)
            }}
            editTask={(taskId) => {
              setTaskModalShow(true)
              setEditMode(tasks.find((t) => t.id === taskId))
            }}
            onDeleteAll={deleteAllTaskHandle}
          />
        ))}

        <AddEditTasksModal
          open={!!taskModalShow}
          onClose={() => setTaskModalShow(false)}
          currentDate={taskModalShow}
          data={tasks.filter((task) => task.date === taskModalShow)}
          reload={getTasks}
          editMode={editMode}
        />
      </div>
    </div>
  )
}
