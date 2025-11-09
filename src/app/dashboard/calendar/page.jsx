import CalendarClient from '@/components/dashboard/CalendarClient'
import { SCHEDULE } from '@/data/api'
import { cookies } from 'next/headers'

export const metadata = {
  title: 'Dashboard | Calendar',
  description:
    'Manage and schedule your tasks and events. View, add, edit, and delete events directly from your calendar with ease.',
}

export default async function CalendarPage() {
  const cookieStore = await cookies()
  const jwtToken = cookieStore.get('jwt')?.value

  const res = await fetch(SCHEDULE, {
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  })

  const data = await res.json()
  const initialSchedule = Array.isArray(data) ? data : []

  return <CalendarClient initialSchedule={initialSchedule} />
}
