// src/app/page.jsx
import HomePageLanguage from '@/components/HomePageLanguage'
import { CONTENT, SOCIAL, SUBSCRIPTIONS } from '@/data/api'

export default async function Home() {
  try {
    const [contentRes, socialRes, subscriptionsRes] = await Promise.all([
      fetch(CONTENT, { cache: 'no-store' }),
      fetch(SOCIAL, { cache: 'no-store' }),
      fetch(SUBSCRIPTIONS, { cache: 'no-store' }),
    ])

    const [content, socials, subscriptions] = await Promise.all([
      contentRes.json(),
      socialRes.json(),
      subscriptionsRes.json(),
    ])

    return (
      <HomePageLanguage
        data={content}
        subscriptions={subscriptions[0]}
        socials={socials}
      />
    )
  } catch (error) {
    console.error('Error fetching home page data:', error)
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load home page data.
      </div>
    )
  }
}
