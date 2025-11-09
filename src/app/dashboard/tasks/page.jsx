import TasksClient from '@/components/dashboard/TasksClient'
import { TASK_BY_DATE } from '@/data/api'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Dashboard | Tasks',
  description:
    'View and manage your personal tasks to stay organized, plan your day, and track your progress effectively.',
}

export default async function TasksPage() {
  const cookieStore = await cookies()
  const jwtToken = cookieStore.get('jwt')?.value

  if (!jwtToken) {
    return redirect('/auth/login')
  }

  // گرفتن داده‌ها از API در سمت سرور
  const startOfWeek = new Date()
  const monday = new Date(startOfWeek)
  monday.setDate(startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7))
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const formatDate = (date) => date.toISOString().split('T')[0]
  const res = await fetch(
    `${TASK_BY_DATE}?startDate=${formatDate(monday)}&endDate=${formatDate(
      sunday
    )}`,
    {
      headers: { Authorization: `Bearer ${jwtToken}` },
      cache: 'no-store',
    }
  )

  if (!res.ok) {
    console.error('Failed to fetch tasks')
    return <div>Failed to load tasks.</div>
  }

  const tasks = await res.json()

  return <TasksClient initialTasks={tasks} />
}
