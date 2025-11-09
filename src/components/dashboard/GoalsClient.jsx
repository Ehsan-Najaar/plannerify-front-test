'use client'

import AddEditGoalsModal from '@/app/dashboard/goals/AddEditGoalsModal'
import ConfirmationModal from '@/components/ConfirmationModal'
import { useTheme } from '@/components/context/ThemeContext'
import GoalTasksModal from '@/components/dashboard/GoalTasksModal'
import Button from '@/components/ui/Button'
import { GOAL } from '@/data/api'
import { useRequest } from '@/hooks/useRequest'
import { useMemo, useState } from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { useTranslation } from 'react-i18next'
import { FaPen, FaTrash } from 'react-icons/fa'
import { toast } from 'react-toastify'

// -------- GoalCard -----------
export function GoalCard({ goal, onEdit, onDelete, onEditTasks }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="relative bg-card rounded-xl shadow shadow-primary p-4 flex flex-col items-center w-64 h-64">
      {/* نوار بالایی */}
      <div className="absolute top-0 left-0 w-full h-3 bg-linear-to-l from-[#C389EF] to-primary rounded-t-xl"></div>

      {/* آیکون‌ها */}
      <div className="w-full flex items-center justify-between p-2 mb-2">
        <div
          className={`${
            isDark ? 'text-primary-light' : 'text-primary'
          } hover:text-purple-800 cursor-pointer transition-all duration-300`}
          onClick={() => onDelete(goal)}
        >
          <FaTrash size={20} />
        </div>
        <div
          className={`${
            isDark ? 'text-primary-light' : 'text-primary'
          } hover:text-purple-800 cursor-pointer transition-all duration-300`}
          onClick={() => onEdit(goal)}
        >
          <FaPen size={20} />
        </div>
      </div>

      {/* دایره پیشرفت با گرادیان */}
      <div
        className="w-32 relative cursor-pointer"
        onClick={() => onEditTasks(goal)}
      >
        <svg style={{ height: 0 }}>
          <defs>
            <linearGradient id="goalGradient" gradientTransform="rotate(100)">
              <stop offset="0%" stopColor="#851FD2" />
              <stop offset="100%" stopColor="#C389EF" />
            </linearGradient>
          </defs>
        </svg>

        <CircularProgressbar
          value={goal.progress}
          text={`${goal.progress}%`}
          strokeWidth={11}
          styles={buildStyles({
            textSize: '18px',
            textColor: isDark ? '#fff' : '#333',
            pathColor: 'url(#goalGradient)',
            trailColor: isDark ? '#fff' : '#e5e7eb',
            strokeLinecap: 'butt',
          })}
        />
      </div>

      {/* نام هدف */}
      <h3
        className="w-36 font-semibold text-lg text-center mt-2 cursor-pointer truncate"
        onClick={() => onEditTasks(goal)}
      >
        {goal.title}
      </h3>

      {/* تاریخ */}
      <p className="text-xs text-gray-500">Due {goal.date}</p>
    </div>
  )
}

// -------- GoalsClient -----------
export default function GoalsClient({ initialGoals }) {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [goals, setGoals] = useState(initialGoals || [])
  const [editMode, setEditMode] = useState()
  const [goalModalShow, setGoalModalShow] = useState(false)
  const [goalToDelete, setGoalToDelete] = useState(null)
  const [tasksModalGoal, setTasksModalGoal] = useState(null)

  const formInit = {
    title: '',
    description: '',
    date: '',
    tasks: [{ title: '', description: '', completed: false, saved: false }],
  }

  const [getGoalsReq] = useRequest({ url: GOAL, method: 'GET' })
  const [goalDeleteReq, goalDeleteLoader] = useRequest({
    url: GOAL,
    method: 'DELETE',
  })

  const [updateTasksReq] = useRequest(
    useMemo(
      () => ({
        url: tasksModalGoal ? `${GOAL}/${tasksModalGoal.id}` : null,
        method: 'PUT',
      }),
      [tasksModalGoal]
    )
  )

  const getGoals = async () => {
    const r = await getGoalsReq()
    setGoals(r)
  }

  const deleteGoal = async () => {
    try {
      await goalDeleteReq({ id: goalToDelete.id })
      toast.success(t('Goal deleted successfully'))
      setGoalToDelete(null)
      getGoals()
    } catch (e) {
      toast.error(t('There was an error. Please try again.'))
    }
  }

  // باز کردن مودال تسک‌ها
  const openTasksModal = (goal) => setTasksModalGoal(goal)

  // ذخیره تغییرات تسک‌ها
  const saveTasks = async (updatedTasks, newProgress) => {
    if (!tasksModalGoal) return

    // چک برای تسک‌های ناقص
    const hasInvalid = updatedTasks.some((t) => !t.title.trim())
    if (hasInvalid) {
      toast.error(t('Task Name can not be empty'))
      return
    }

    try {
      await updateTasksReq(
        {
          title: tasksModalGoal.title,
          description: tasksModalGoal.description,
          date: tasksModalGoal.date,
          tasks: updatedTasks,
          progress: newProgress,
        },
        { id: tasksModalGoal.id }
      )

      toast.success(t('Tasks updated successfully'))
      setTasksModalGoal(null)
      getGoals()
    } catch (e) {
      console.error(e)
      toast.error(e.response?.data?.message || e.message)
    }
  }

  return (
    <div className="min-h-[calc(100vh-35px)] border-2 border-border shadow p-4 rounded-lg flex flex-col">
      {/* هدر */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h1 className="text-2xl font-semibold text-text">{t('My Goals')}</h1>
        <Button
          caption={t('Set New Goal')}
          onClick={() => {
            setEditMode(undefined)
            setGoalModalShow(true)
          }}
        />
      </div>

      {/* لیست اهداف */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 place-items-center gap-8 mt-6">
        {goals.length > 0 ? (
          goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={(goal) => {
                setEditMode(goal)
                setGoalModalShow(true)
              }}
              onDelete={(goal) => setGoalToDelete(goal)}
              onEditTasks={openTasksModal}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center h-[80vh]">
            <p className="font-semibold text-2xl">No Goal added yet</p>
          </div>
        )}
      </div>

      {/* مودال افزودن / ویرایش */}
      <AddEditGoalsModal
        open={goalModalShow}
        formInit={formInit}
        onClose={() => setGoalModalShow(false)}
        reload={getGoals}
        editMode={editMode}
        isDark={isDark}
      />

      {/* مودال تسک‌ها */}
      <GoalTasksModal
        open={!!tasksModalGoal}
        onClose={() => setTasksModalGoal(null)}
        goal={tasksModalGoal}
        onSave={saveTasks}
        isDark={isDark}
      />

      {/* مودال تأیید حذف */}
      <ConfirmationModal
        open={!!goalToDelete}
        onClose={() => setGoalToDelete(null)}
        title={t('Delete Goal')}
        message={t('Do you want to delete this goal?')}
        yesCaption={t('Delete')}
        noCaption={t('Cancel')}
        confirmHandle={deleteGoal}
        loading={goalDeleteLoader}
      />
    </div>
  )
}
