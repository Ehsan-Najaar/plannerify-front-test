'use client'

import AddEditPlansModal from '@/app/dashboard/plans/AddEditPlansModal'
import Checkbox from '@/components/ui/Checkbox'
import { PLAN, PLAN_SETTINGS } from '@/data/api'
import { useRequest } from '@/hooks/useRequest'
import { Add, Edit2, Setting2 } from 'iconsax-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

// ------------------ Card Component ------------------
const Card = ({
  category,
  plans,
  createPlan,
  editPlan,
  colorize,
  plansReload,
}) => {
  const { t } = useTranslation()
  const [donePlans, setDonePlans] = useState([])

  useEffect(() => {
    setDonePlans(plans.map((plan) => ({ id: plan.id, done: plan.done })))
  }, [plans, colorize])

  const [doneReq] = useRequest({ url: PLAN, method: 'PATCH' })

  const colors =
    localStorage.getItem('theme') === 'dark'
      ? [null, '#B00020', '#FFAB00', '#26A69A']
      : [null, '#FFCDD2', '#FFECB3', '#B2DFDB']

  const doneToggle = (id) => {
    doneReq({ id })
      .then(() => plansReload())
      .catch(() => toast.error(t('An error occurred. Please try later.')))
  }

  const priorityOptions = [
    { name: t('Low'), code: 3 },
    { name: t('Medium'), code: 2 },
    { name: t('High'), code: 1 },
  ]

  return (
    <div className="bg-plans text-text p-4 rounded-md shadow ">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold first-letter:uppercase">
          {t(`${category} Plans`)}
        </h1>
        <button
          onClick={() => createPlan(category)}
          className="bg-white/50 rounded-full"
        >
          <Add size={24} color="#333" />
        </button>
      </div>
      <ul className="mt-4 flex flex-col gap-2">
        {plans.map((plan) => (
          <li
            key={plan.id}
            className="bg-opacity-60 p-2 rounded-md shadow"
            style={{
              backgroundColor: colorize
                ? colors[plan.priority]
                : localStorage.getItem('theme') === 'dark'
                ? 'rgba(255,255,255,0.2)'
                : 'rgba(255,255,255,0.6)',
            }}
          >
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <span
                  className={`flex-1 line-clamp-1 font-medium ${
                    donePlans.some((t) => t.id === plan.id && t.done)
                      ? 'line-through'
                      : ''
                  }`}
                >
                  {plan.title}
                </span>
                <span
                  className={`flex-1 line-clamp-1 text-sm opacity-80 ${
                    donePlans.some((t) => t.id === plan.id && t.done)
                      ? 'line-through'
                      : ''
                  }`}
                >
                  {plan.description}
                </span>
              </div>
              <div className="flex gap-1 items-center">
                <Checkbox
                  type="checkbox"
                  value={donePlans.find((t) => t.id === plan.id)?.done}
                  onChange={(e) => {
                    setDonePlans(
                      donePlans.map((t) =>
                        t.id === plan.id ? { ...t, done: e } : t
                      )
                    )
                    doneToggle(plan.id)
                  }}
                />
                <button onClick={() => editPlan(plan.id)}>
                  <Edit2 variant="Bulk" size={20} color="var(--text)" />
                </button>
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <div className="font-bold opacity-40 text-sm">
                {plan.dueDate && (
                  <>
                    <label>{t('Due:')}</label>
                    <span>{plan.dueDate}</span>
                  </>
                )}
              </div>
              <div className="font-bold opacity-40 text-sm">
                <label>{t('Priority:')}</label>
                <span>
                  {priorityOptions.find((o) => o.code === plan.priority)?.name}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ------------------ Plans Client Component ------------------
export default function PlansClient({
  initialPlans = [],
  initialPlanSettings = {},
}) {
  const { t } = useTranslation()
  const [planModalShow, setPlanModalShow] = useState(false)
  const [plans, setPlans] = useState(
    Array.isArray(initialPlans) ? initialPlans : []
  )
  const [planSettings, setPlanSettings] = useState(initialPlanSettings)

  const [getPlansReq] = useRequest({ url: PLAN, method: 'GET' })
  const [getPlanSettingsReq] = useRequest({ url: PLAN_SETTINGS, method: 'GET' })
  const [updatePlanSettingsReq] = useRequest({
    url: PLAN_SETTINGS,
    method: 'PATCH',
  })

  const isInitialMount = useRef(true)
  const [editMode, setEditMode] = useState()

  const getPlans = () => getPlansReq().then((r) => setPlans(r))
  const getPlanSettings = () =>
    getPlanSettingsReq().then((r) => setPlanSettings(r))

  useEffect(() => {
    if (!initialPlans.length) getPlans()
    if (!Object.keys(initialPlanSettings).length) getPlanSettings()
  }, [])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    updatePlanSettingsReq(planSettings)
      .then(() => console.log('Settings updated'))
      .catch(() => toast.error(t('An error occurred. Please try again')))
  }, [planSettings])

  const categories = ['work', 'gym', 'study']

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[auto_260px] gap-4 h-full items-start">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
        {categories.map((category) => (
          <Card
            key={category}
            category={category}
            plans={plans
              .filter((plan) => plan.category === category)
              .sort((a, b) => a.id - b.id)}
            createPlan={(currentCategory) => {
              setEditMode(undefined)
              setPlanModalShow(currentCategory)
            }}
            editPlan={(planId) => {
              setPlanModalShow(true)
              setEditMode(plans.find((plan) => plan.id === planId))
            }}
            colorize={planSettings.priorityColors}
            plansReload={getPlans}
          />
        ))}
        <AddEditPlansModal
          open={!!planModalShow}
          onClose={() => setPlanModalShow(false)}
          currentCategory={planModalShow}
          data={plans.filter((plan) => plan.category === planModalShow)}
          reload={getPlans}
          editMode={editMode}
        />
      </div>
      <div className="bg-card text-text p-4 rounded-lg h-full">
        <h1 className="flex items-center gap-2">
          <Setting2 size={20} color="var(--text)" />{' '}
          <span className="font-semibold">{t('Settings')}</span>
        </h1>
        <div className="mt-6 flex flex-col gap-2">
          <Checkbox
            label={t('Enable Priority Colors')}
            value={planSettings.priorityColors}
            onChange={(e) =>
              setPlanSettings({ ...planSettings, priorityColors: e })
            }
          />
          <Checkbox
            label={t('Notification')}
            value={planSettings.notification}
            onChange={(e) =>
              setPlanSettings({ ...planSettings, notification: e })
            }
          />
        </div>
      </div>
    </div>
  )
}
