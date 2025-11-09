import SurveysClient from '@/components/dashboard/SurveysClient'
import { SURVEY } from '@/data/api'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Dashboard | Surveys',
  description:
    'Create, manage, and participate in surveys easily. Track your submissions and explore user-friendly survey tools on your personal dashboard.',
}

export default async function SurveysPage() {
  const cookieStore = await cookies()
  const jwtToken = cookieStore.get('jwt')?.value

  let surveys = []
  try {
    const res = await fetch(SURVEY, {
      headers: {
        Authorization: jwtToken ? `Bearer ${jwtToken}` : '',
      },
      cache: 'no-store',
    })

    if (res.ok) {
      const data = await res.json()
      surveys = data
    } else {
      console.error('Failed to fetch surveys:', res.statusText)
    }
  } catch (err) {
    console.error('Error fetching surveys:', err)
  }

  return <SurveysClient surveys={surveys} />
}
