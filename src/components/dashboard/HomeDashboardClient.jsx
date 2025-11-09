'use client'

import Box from '@/components/ui/Box'
import Button, { TextButton } from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import {
  ArrowRight2,
  ArrowUp,
  BookSquare,
  LampOn,
  SmsSearch,
  StatusUp,
  Task,
} from 'iconsax-react'
import { Circle } from 'rc-progress'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import AddEditGoalsModal from '@/app/dashboard/goals/AddEditGoalsModal'
import AddEditIdeasModal from '@/app/dashboard/ideas/AddEditIdeasModal'
import AddEditSurveyModal from '@/app/dashboard/surveys/AddEditSurveyModal'
import AddEditTasksModal from '@/app/dashboard/tasks/AddEditTasksModal'
import { useTheme } from '@/components/context/ThemeContext'
import TaskOverviewChart from '@/components/dashboard/TaskOverviewChart'
import { TASK_DONE_TOGGLE } from '@/data/api'
import { useRequest } from '@/hooks/useRequest'
import { toast } from 'react-toastify'

const IdeaRow = ({ title, description, onView }) => {
  const { t } = useTranslation()
  return (
    <li className="flex gap-4 items-center my-2">
      <div className="w-8 h-8 min-w-8 bg-slate-500 bg-opacity-20 flex items-center justify-center rounded-full">
        <LampOn size="16" color="var(--text)" variant="Bold" />
      </div>
      <div className="flex-1 overflow-hidden">
        <h1 className="font-semibold overflow-hidden text-ellipsis text-nowrap">
          {title}
        </h1>
        <p className="text-sm text-slate-400 overflow-hidden text-ellipsis text-nowrap">
          {description}
        </p>
      </div>
      <Button caption={t('View')} size="small" onClick={onView} />
    </li>
  )
}

const TaskRow = ({
  title,
  status,
  onView,
  task,
  doneTasks,
  setDoneTasks,
  doneToggle,
}) => {
  const { t } = useTranslation()
  return (
    <li className="flex gap-4 items-center my-2">
      <div
        className={`w-8 h-8 min-w-8 bg-slate-500 bg-opacity-20 flex items-center justify-center rounded-full border-2 border-solid ${
          task.priority === 3 ? 'border-red-600' : ''
        } ${task.priority === 2 ? 'border-yellow-600' : ''} ${
          task.priority === 1 ? 'border-green-600' : ''
        }`}
      >
        <Task size="16" color="var(--text)" variant="Bold" />
      </div>
      <Checkbox
        type="checkbox"
        value={doneTasks.find((t) => t.id === task.id)?.done}
        onChange={(e) => {
          setDoneTasks(
            doneTasks.map((t) => (t.id === task.id ? { ...t, done: e } : t))
          )
          doneToggle(task.id)
        }}
      />
      <div className="flex-1 overflow-hidden">
        <h1 className="font-semibold overflow-hidden text-ellipsis text-nowrap">
          {title}
        </h1>
        {status === 'completed' && (
          <div className="bg-green-700 text-white h-6 rounded-full text-xs flex items-center justify-center w-fit px-2">
            {t('Completed')}
          </div>
        )}
        {status === 'in-progress' && (
          <div className="bg-yellow-600 text-white h-6 rounded-full text-xs flex items-center justify-center w-fit px-2">
            {t('In Progress')}
          </div>
        )}
      </div>
      <div className="flex gap-1">
        <Button caption={t('View')} size="small" onClick={onView} />
      </div>
    </li>
  )
}

const SurveyRow = ({ title, description, onView, answered }) => {
  const { t } = useTranslation()
  return (
    <li className="flex gap-4 items-center my-2">
      <div
        className={`w-8 h-8 min-w-8  flex items-center justify-center rounded-full ${
          answered ? 'bg-green-600' : 'bg-slate-500 bg-opacity-20'
        }`}
      >
        <SmsSearch size="16" color="var(--text)" variant="Bold" />
      </div>
      <div className="flex-1 overflow-hidden">
        <h1 className="font-semibold overflow-hidden text-ellipsis text-nowrap">
          {title}
        </h1>
        <p className="text-sm text-slate-400 overflow-hidden text-ellipsis text-nowrap">
          {description}
        </p>
      </div>
      <Button caption={t('View')} size="small" onClick={onView} />
    </li>
  )
}

const ProgressItem = ({ category, value }) => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-2 w-28 ">
      <div className="w-6 h-6">
        <Circle
          percent={value}
          strokeWidth={12}
          strokeColor="var(--primary)"
          trailWidth={12}
          trailColor="#efd9ff"
        />
      </div>
      <div>
        <h2 className="text-sm font-semibold">{value}%</h2>
        <p className="text-xs text-text opacity-70 capitalize">{t(category)}</p>
      </div>
      <ArrowUp
        size={20}
        color="var(--text)"
        variant="Bold"
        className="self-start"
      />
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null
  const containerStyle = {
    backgroundColor: 'var(--background)',
    color: 'var(--text)',
    padding: '8px 12px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    fontSize: '14px',
  }
  return (
    <div style={containerStyle}>
      <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
      {payload.map((entry, index) => (
        <p key={index} style={{ margin: 0 }}>
          {entry.name === 'done'
            ? `Done: ${entry.value}`
            : entry.name === 'undone'
            ? `Undone: ${entry.value}`
            : `${entry.name}: ${entry.value}`}
        </p>
      ))}
    </div>
  )
}

export default function HomeDashboardClient({ data }) {
  const { goals, ideas, surveys, taskOverview, planOverview, tasks } = data
  const { t } = useTranslation()
  const theme = useTheme()
  const isDark = theme === 'dark'

  const [currentTaskOverviewPeriod, setCurrentTaskOverviewPeriod] =
    useState('daily')

  const [doneTasks, setDoneTasks] = useState(
    tasks.map((task) => ({ id: task.id, done: task.done }))
  )
  const [currentTaskOverviewYear, setCurrentTaskOverviewYear] = useState(
    taskOverview?.[taskOverview.length - 1]?.year
  )

  const [goalModalShow, setGoalModalShow] = useState(false)
  const [goalEditMode, setGoalEditMode] = useState(false)

  const [ideaModalShow, setIdeaModalShow] = useState(false)
  const [ideaEditMode, setIdeaEditMode] = useState(false)

  const [surveyModalShow, setSurveyModalShow] = useState(false)
  const [taskModalShow, setTaskModalShow] = useState(false)

  const [doneReq] = useRequest({ url: TASK_DONE_TOGGLE, method: 'PATCH' })

  const doneToggle = (id) => {
    doneReq({ id })
      .then(() => toast.success(t('Task status updated')))
      .catch(() => toast.error(t('An error occurred. Please try later.')))
  }

  useEffect(() => {
    setDoneTasks(tasks.map((task) => ({ id: task.id, done: task.done })))
  }, [tasks])

  useEffect(() => {
    setCurrentTaskOverviewYear(taskOverview?.[taskOverview.length - 1]?.year)
  }, [taskOverview])

  // آماده‌سازی داده برای نمودار تسک‌ها
  let taskOverviewData
  if (currentTaskOverviewYear === 'all') {
    taskOverviewData = taskOverview.map((item) => ({
      name: item.year,
      done: Object.entries(item.data).reduce(
        (total, [month, data]) => total + data.done,
        0
      ),
      undone: Object.entries(item.data).reduce(
        (total, [month, data]) => total + data.undone,
        0
      ),
    }))
  } else {
    const currentTaskOverview = Array.isArray(taskOverview)
      ? taskOverview.find((item) => item.year === currentTaskOverviewYear)?.data
      : null

    taskOverviewData = currentTaskOverview
      ? Object.entries(currentTaskOverview).map(([month, data]) => ({
          name: month,
          done: data.done,
          undone: data.undone,
        }))
      : []
  }

  return (
    <div>
      <AddEditGoalsModal
        open={!!goalModalShow}
        onClose={() => setGoalModalShow(false)}
        editMode={goalEditMode}
        reload={() => {}}
      />
      <AddEditIdeasModal
        open={!!ideaModalShow}
        onClose={() => setIdeaModalShow(false)}
        editMode={ideaEditMode}
        reload={() => {}}
      />
      <AddEditSurveyModal
        open={!!surveyModalShow}
        onClose={() => setSurveyModalShow(false)}
        editMode={surveyModalShow}
        reload={() => {}}
      />
      <AddEditTasksModal
        open={!!taskModalShow}
        onClose={() => setTaskModalShow(false)}
        currentDate={taskModalShow}
        data={tasks.filter((task) => task.date === taskModalShow)}
        reload={() => {}}
        editMode={taskModalShow}
      />
      {/* Goals & Ideas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Goals */}
        <Box>
          <h1 className="flex items-center gap-2">
            <BookSquare color="var(--primary)" size="24" variant="Bold" />
            <span className="text-lg text-primary font-semibold ">
              {t('Goals')}
            </span>
          </h1>
          {goals.length === 0 ? (
            <div className="text-center my-10">
              <BookSquare
                color="var(--primary)"
                size="60"
                variant="Bold"
                className="mx-auto"
              />
              <span className="italic text-slate-400">
                {t('You have no goals yet!')}
              </span>
              <Button
                caption={t('Add your first goal')}
                className="mx-auto mt-4"
                onClick={() => {
                  setGoalModalShow(true)
                  setGoalEditMode(false)
                }}
              />
            </div>
          ) : (
            <>
              <ul className="flex flex-col gap-1 mt-4 flex-1">
                {goals.slice(0, 3).map((goal, index) => (
                  <IdeaRow
                    key={index}
                    title={goal.title}
                    description={goal.description}
                    onView={() => {
                      setGoalModalShow(goal)
                      setGoalEditMode(goal)
                    }}
                  />
                ))}
              </ul>
              <TextButton
                caption={t('View All Goals')}
                href="/dashboard/goals"
                className="ml-auto mt-8 "
                rightIcon={<ArrowRight2 size={12} color="var(--primary)" />}
              />
            </>
          )}
        </Box>
        {/* Ideas */}
        <Box>
          <h1 className="flex items-center gap-2">
            <LampOn size="24" color="var(--primary)" variant="Bold" />
            <span className="text-lg text-primary font-semibold ">
              {t('Ideas')}
            </span>
          </h1>
          {ideas.length === 0 ? (
            <div className="text-center my-10">
              <LampOn
                color="var(--primary)"
                size="60"
                variant="Bold"
                className="mx-auto"
              />
              <span className="italic text-slate-400">
                {t('You have no ideas yet!')}
              </span>
              <Button
                caption={t('Add your first idea')}
                className="mx-auto mt-4"
                onClick={() => {
                  setIdeaModalShow(true)
                  setIdeaEditMode(false)
                }}
              />
            </div>
          ) : (
            <>
              <ul className="flex flex-col gap-1 mt-4 flex-1">
                {ideas.slice(0, 3).map((idea, index) => (
                  <IdeaRow
                    key={index}
                    title={idea.title}
                    description={idea.description}
                    onView={() => {
                      setIdeaModalShow(idea)
                      setIdeaEditMode(idea)
                    }}
                  />
                ))}
              </ul>
              <TextButton
                caption={t('View All Ideas')}
                className="ml-auto mt-8 "
                rightIcon={<ArrowRight2 size={12} color="var(--primary)" />}
                href="/dashboard/ideas"
              />
            </>
          )}
        </Box>
      </div>

      {/* Plans & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-4">
        {/* Plans */}
        <Box>
          <h1 className="flex items-center gap-2">
            <StatusUp size="24" color="var(--primary)" variant="Bold" />
            <span className="text-lg text-primary font-semibold ">
              {t('Plans Progress')}
            </span>
          </h1>
          <div className="flex flex-col lg:flex-row items-center gap-16 mt-10 px-10 pb-8">
            <div className="relative w-[180px] h-[180px] flex items-center justify-center">
              <div className="absolute z-1 w-[180px] h-[180px]">
                <Circle
                  percent={planOverview.overalProgress || 0}
                  strokeWidth={5}
                  strokeColor="var(--primary)"
                  trailWidth={5}
                  trailColor="#efd9ff"
                />
              </div>
              <div className="bg-primary  w-[140px] h-[140px] rounded-full flex flex-col items-center justify-center">
                <span className="text-white text-3xl font-semibold">
                  %{planOverview.overalProgress || 0}
                </span>
                <span className="text-white text-xs">
                  {t('Overal Progress')}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-14 gap-y-6">
              <ProgressItem
                category="study"
                value={planOverview.result.study || 0}
              />
              <ProgressItem
                category="work"
                value={planOverview.result.work || 0}
              />
              <ProgressItem
                category="gym"
                value={planOverview.result.gym || 0}
              />
            </div>
          </div>
        </Box>
        {/* Tasks */}
        <Box>
          <h1 className="flex items-center gap-2">
            <Task size="24" color="var(--primary)" variant="Bold" />
            <span className="text-lg text-primary font-semibold ">
              {t('Tasks')}
            </span>
          </h1>
          {tasks.length === 0 ? (
            <div className="text-center my-10">
              <Task
                color="var(--primary)"
                size="60"
                variant="Bold"
                className="mx-auto"
              />
              <span className="italic text-slate-400">
                {t('You have no task yet!')}
              </span>
              <Button
                caption={t('Add your first Task')}
                className="mx-auto mt-4"
                href="/dashboard/tasks"
              />
            </div>
          ) : (
            <ul className="flex flex-col gap-1 mt-4 flex-1">
              {tasks.slice(0, 5).map((task, index) => (
                <TaskRow
                  key={index}
                  title={task.title}
                  status={task.done ? 'completed' : 'in-progress'}
                  onView={() => setTaskModalShow(task)}
                  task={task}
                  doneTasks={doneTasks}
                  setDoneTasks={setDoneTasks}
                  doneToggle={doneToggle}
                />
              ))}
            </ul>
          )}
          <TextButton
            caption={t('View All Tasks')}
            className="ml-auto mt-8 "
            rightIcon={<ArrowRight2 size={12} color="var(--primary)" />}
            href="/dashboard/tasks"
          />
        </Box>
      </div>

      {/* Tasks Overview & Surveys */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4">
        {/* Task Overview Chart */}
        <TaskOverviewChart taskOverview={taskOverview} isDark={isDark} />

        {/* Surveys */}
        <Box>
          <h1 className="flex items-center gap-2">
            <SmsSearch size="24" color="var(--primary)" variant="Bold" />
            <span className="text-lg text-primary font-semibold ">
              {t('Surveys')}
            </span>
          </h1>
          {surveys.length === 0 ? (
            <div className="text-center my-10">
              <SmsSearch
                color="var(--primary)"
                size="60"
                variant="Bold"
                className="mx-auto"
              />
              <span className="italic text-slate-400">
                {t('You have no surveys yet!')}
              </span>
              <Button
                caption={t('Add your first survey')}
                className="mx-auto mt-4"
                href="/dashboard/surveys"
              />
            </div>
          ) : (
            <ul className="flex flex-col gap-1 mt-4 flex-1">
              {surveys.slice(0, 3).map((survey, index) => (
                <SurveyRow
                  key={index}
                  title={survey.name}
                  description={survey.description}
                  onView={() => setSurveyModalShow(survey)}
                  answered={survey.answer}
                />
              ))}
            </ul>
          )}
          <TextButton
            caption={t('View All Surveys')}
            className="ml-auto mt-8 "
            rightIcon={<ArrowRight2 size={12} color="var(--primary)" />}
            href="/dashboard/surveys"
          />
        </Box>
      </div>
    </div>
  )
}
