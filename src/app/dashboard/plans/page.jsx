import PlansClient from '@/components/dashboard/PlansClient'
import { PLAN, PLAN_SETTINGS } from '@/data/api'

export const metadata = {
  title: 'Dashboard | Plans',
  description:
    'Create, manage, and customize your plans easily. Track progress and organize your tasks with a user-friendly dashboard.',
}

export default async function PlansPage() {
  const [plansRes, settingsRes] = await Promise.all([
    fetch(PLAN, { cache: 'no-store' }),
    fetch(PLAN_SETTINGS, { cache: 'no-store' }),
  ])
  const [plans, planSettings] = await Promise.all([
    plansRes.json(),
    settingsRes.json(),
  ])

  return <PlansClient initialPlans={plans} initialSettings={planSettings} />
}
