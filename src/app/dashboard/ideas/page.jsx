import IdeasClient from '@/components/dashboard/IdeasClient'
import { IDEA } from '@/data/api'
import { cookies } from 'next/headers'

export const metadata = {
  title: 'Dashboard | Ideas',
  description:
    'Capture, manage, and develop your ideas easily. Organize your thoughts and track progress using a user-friendly dashboard.',
}

export default async function IdeasPage() {
  try {
    const cookieStore = await cookies()
    const jwtToken = cookieStore.get('jwt')?.value

    const res = await fetch(IDEA, {
      headers: {
        Authorization: jwtToken ? `Bearer ${jwtToken}` : '',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      return <div>Unauthorized or failed to load ideas</div>
    }

    const initialIdeas = await res.json()

    return <IdeasClient initialIdeas={initialIdeas} />
  } catch (err) {
    return <div>Failed to load ideas</div>
  }
}
