import Footer from '@/components/Landing/Footer'
import LandingHeader from '@/components/Landing/Header'
import { LANGUAGE, TERMS } from '@/data/api'

export const metadata = {
  title: 'plannerify.io | Terms of Service',
  description:
    'Review plannerify.io Terms of Service to understand the rules, responsibilities, and conditions for using our task and goal management platform. Your use of plannerify.io means you agree to these terms.',
}

export const dynamic = 'force-dynamic'

export default async function TermsPage() {
  let contentHtml = ''
  let direction = 'ltr'

  try {
    // ✅ SSR fetch — no-store یعنی در هر ریکوئست از سرور بگیر
    const langsRes = await fetch(LANGUAGE, { cache: 'no-store' })
    if (!langsRes.ok) throw new Error('Failed to load languages')

    const languages = await langsRes.json()
    const lang = languages?.[0]
    if (!lang) throw new Error('No languages found')

    direction = lang.direction === 'rtl' ? 'rtl' : 'ltr'

    const termsRes = await fetch(
      `${TERMS}/?languageId=${lang.id}&offset=0&limit=1`,
      { cache: 'no-store' }
    )
    if (!termsRes.ok) throw new Error('Failed to load terms')

    const termsJson = await termsRes.json()
    const termsItem = Array.isArray(termsJson?.items)
      ? termsJson.items[0]
      : Array.isArray(termsJson)
      ? termsJson[0]
      : null

    contentHtml = termsItem?.contentHtml || ''
  } catch (e) {
    console.error('Error loading terms:', e)
  }

  return (
    <>
      <style>
        {`
          .terms-page h1{
            font-size: 2.5rem;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 1rem;
          }
          .terms-page h2{
            font-size: 2rem;
            font-weight: 600;
            line-height: 1.3;
            margin-bottom: 1rem;
          }
          .terms-page h3{
            font-size: 1.75rem;
            font-weight: 500;
            line-height: 1.4;
            margin-bottom: 1rem;
          }
          .terms-page p{
            font-size: 1rem;
            line-height: 1.6;
            margin-bottom: 1rem;
          }
          .terms-page a{
            color: #1e90ff;
            text-decoration: underline;
          }
        `}
      </style>

      <div className="max-w-[1400px] mx-auto px-10">
        <style>{`body{background-color: black!important; background-image: url(/assets/images/bg.png); background-repeat: no-repeat; background-position: top center}`}</style>

        <LandingHeader />

        <main className="my-10 text-white terms-page">
          {contentHtml ? (
            <section
              dir={direction}
              className="prose prose-invert max-w-none leading-7"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          ) : (
            <div className="text-red-300">Failed to load terms</div>
          )}
        </main>

        <Footer />
      </div>
    </>
  )
}
