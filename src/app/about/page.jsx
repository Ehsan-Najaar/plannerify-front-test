// src/app/about/page.js

import Footer from '@/components/Landing/Footer'
import LandingHeader from '@/components/Landing/Header'
import { ABOUT, LANGUAGE } from '@/data/api'

export const metadata = {
  title: 'plannerify.io | About',
  description:
    'Learn more about Plannerify — a productivity platform designed to help you set goals, organize ideas, and plan your future with clarity and focus.',
}

export const revalidate = 60

async function fetchData() {
  try {
    const langsRes = await fetch(LANGUAGE)
    if (!langsRes.ok) throw new Error('Failed to load languages')
    const languages = await langsRes.json()

    const code = null
    const lang =
      (code && languages.find((l) => l.languageCode === code)) || languages?.[0]

    if (!lang) return { direction: 'ltr', contentHtml: '' }

    const aboutRes = await fetch(
      `${ABOUT}/?languageId=${lang.id}&offset=0&limit=1`
    )
    if (!aboutRes.ok) throw new Error('Failed to load about content')
    const aboutJson = await aboutRes.json()
    const aboutItem = Array.isArray(aboutJson?.items)
      ? aboutJson.items[0]
      : Array.isArray(aboutJson)
      ? aboutJson[0]
      : null

    return {
      direction: lang.direction === 'rtl' ? 'rtl' : 'ltr',
      contentHtml: aboutItem?.contentHtml || '',
    }
  } catch (e) {
    return {
      direction: 'ltr',
      contentHtml: '',
      error: e?.message || 'Load failed',
    }
  }
}

export default async function AboutPage() {
  const { direction, contentHtml, error } = await fetchData()

  return (
    <div>
      <div className="max-w-[1400px] mx-auto px-10">
        <style>{`body{background-color: black!important; background-image: url(/assets/images/bg.png); background-repeat: no-repeat; background-position: top center}`}</style>

        {/* استایل‌های سفارشی about-page */}
        <style>{`
          .about-page h1 {
            font-size: 2.5rem;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 1rem;
          }
          .about-page h2 {
            font-size: 2rem;
            font-weight: 600;
            line-height: 1.3;
            margin-bottom: 1rem;
          }
          .about-page h3 {
            font-size: 1.75rem;
            font-weight: 500;
            line-height: 1.4;
            margin-bottom: 1rem;
          }
          .about-page p {
            font-size: 1rem;
            line-height: 1.6;
            margin-bottom: 1rem;
          }
          .about-page a {
            color: #1e90ff;
            text-decoration: underline;
          }
        `}</style>

        <LandingHeader />

        <main className="my-10 about-page">
          {error ? (
            <div className="text-red-300">{error}</div>
          ) : contentHtml ? (
            <section
              dir={direction}
              className="prose prose-invert max-w-none leading-7 text-white"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          ) : null}
        </main>

        <Footer />
      </div>
    </div>
  )
}
