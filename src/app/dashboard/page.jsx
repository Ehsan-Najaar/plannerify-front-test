import HomeDashboardClient from '@/components/dashboard/HomeDashboardClient'
import { GOAL, IDEA, PLAN, SURVEY, TASK, TASK_BY_DATE } from '@/data/api'
import { cookies } from 'next/headers'

export const metadata = {
  title: 'Dashboard | Home',
  description:
    'Dashboard overview showing goals, ideas, and plans to help you track progress effectively.',
}

export default async function Dashboard() {
  const cookieStore = await cookies()
  const jwtToken = cookieStore.get('jwt')?.value

  const headers = { Authorization: `Bearer ${jwtToken}` }

  const [
    goalsRes,
    ideasRes,
    taskOverviewRes,
    planOverviewRes,
    surveyRes,
    tasksRes,
  ] = await Promise.all([
    fetch(GOAL, { headers, cache: 'no-store' }),
    fetch(IDEA, { headers, cache: 'no-store' }),
    fetch(TASK + '/overview', { headers, cache: 'no-store' }),
    fetch(PLAN + '/overview', { headers, cache: 'no-store' }),
    fetch(SURVEY, { headers, cache: 'no-store' }),
    fetch(TASK_BY_DATE, { headers, cache: 'no-store' }),
  ])

  const [goals, ideas, taskOverview, planOverview, survey, tasks] =
    await Promise.all([
      goalsRes.json(),
      ideasRes.json(),
      taskOverviewRes.json(),
      planOverviewRes.json(),
      surveyRes.json(),
      tasksRes.json(),
    ])

  return (
    <HomeDashboardClient
      data={{
        goals,
        ideas,
        taskOverview,
        planOverview,
        surveys: survey,
        tasks,
      }}
    />
  )
}
