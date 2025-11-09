import GoalsClient from '@/components/dashboard/GoalsClient'
import { GOAL } from '@/data/api'
import { cookies } from 'next/headers'

export const metadata = {
  title: 'Dashboard | Goals',
  description:
    'Set, track, and achieve your goals. Organize your objectives and monitor your progress easily.',
}

export default async function GoalsPage() {
  const cookieStore = await cookies()
  const jwtToken = cookieStore.get('jwt')?.value

  const res = await fetch(GOAL, {
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  })

  const data = await res.json()
  const initialGoals = Array.isArray(data) ? data : []

  return <GoalsClient initialGoals={initialGoals} />
}
