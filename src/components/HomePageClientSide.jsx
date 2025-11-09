'use client'

import Footer from '@/components/Landing/Footer'
import LandingHeader from '@/components/Landing/Header'
import Button from '@/components/ui/Button'
import { arrayShuffle, groupFeedbacks, safeParseJSON } from '@/utils/utils'
import { TickSquare } from 'iconsax-react'
import Image from 'next/image'
import { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'

const FeatureCard = ({ title, description, image, bg }) => (
  <div className="bg-black w-full border border-solid border-white/20 rounded-xl text-white p-10 overflow-hidden relative">
    {bg && (
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/assets/images/bg.png"
          alt="bg"
          fill
          className="object-cover"
        />
      </div>
    )}
    <div className="relative z-2">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-sm mt-6">{description}</p>
      <div className="aspect-[2.5] overflow-hidden mt-10 relative">
        <Image src={image} alt="thumb" fill className="object-cover" />
      </div>
    </div>
  </div>
)

const PricingCard = ({ title, description, price, features, main }) => {
  const { t } = useTranslation()
  return (
    <div
      className={`w-full border border-solid border-white/20 rounded-xl text-white p-6 overflow-hidden relative ${
        main ? 'bg-primary-dark' : ''
      }`}
    >
      <h3 className="font-semibold text-2xl">{title}</h3>
      <p className="mt-4 text-sm">{description}</p>
      <div className="flex items-baseline gap-1 mt-4">
        <span className="text-5xl font-semibold">${price}</span>
        {price > 0 && (
          <span className="opacity-80 text-xs">{t('per month')}</span>
        )}
      </div>
      <Button
        caption={t('Get Started')}
        href="/auth/register"
        className="mt-10 w-full"
      />
      <ul className="mt-10">
        {features.map((feature, index) => (
          <li className="my-4 text-sm flex gap-1" key={index}>
            <TickSquare size={18} color="white" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  )
}

const CustomerCard = ({ image, name, tag, body }) => (
  <div className="border border-solid border-white/20 rounded-xl text-white p-6 overflow-hidden relative">
    <div className="flex gap-2">
      <div className="w-12 h-12 rounded-full overflow-hidden relative">
        <Image src={image} alt="thumb" fill className="object-cover" />
      </div>
      <div>
        <h3 className="font-semibold">{name}</h3>
        <p className="text-xs opacity-30">{tag}</p>
      </div>
    </div>
    <div className="text-sm mt-4">{body}</div>
  </div>
)

export default function HomePageClientSide({ data, subscriptions, socials }) {
  const customerContainer = useRef()
  const { t } = useTranslation()

  const feedBacks = useMemo(() => groupFeedbacks(data), [data])
  const shuffledFeedBacks = useMemo(
    () => [arrayShuffle(feedBacks), arrayShuffle(feedBacks)],
    [feedBacks]
  )

  useEffect(() => {
    const container = customerContainer.current
    if (!container) return
    const containerHeight = container.offsetHeight
    let marginTop = 0
    let frame
    const step = () => {
      if (marginTop < containerHeight - 600) marginTop += 1
      else marginTop = 0
      container.style.marginTop = -marginTop + 'px'
      frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [])

  const dataMap = useMemo(
    () => Object.fromEntries(data.map((r) => [r.key, r.value])),
    [data]
  )

  return (
    <div className="max-w-[1400px] mx-auto px-10">
      <style>{`body{background-color: black!important; background-image: url(/assets/images/bg.png); background-repeat: no-repeat; background-position: top center}`}</style>
      <LandingHeader />

      {/* Hero Section */}
      <h1 className="text-[2.5rem] lg:text-[3.5rem] xl:text-[4.5rem] text-white font-semibold text-center leading-18 mt-28 max-w-[1200px] mx-auto">
        {dataMap.heroText}
      </h1>
      <p className="text-white text-xl text-center mt-10">
        {t(dataMap.heroDescription)}
      </p>
      <Button
        caption={t("Let's Start")}
        className="h-14 px-16! mx-auto mt-20"
        href="/dashboard"
      />
      <div className="p-3 border border-solid border-white/25 bg-white/5 backdrop-blur-3xl rounded-2xl mt-20 mx-auto max-w-[1000px]">
        <video autoPlay loop playsInline className="rounded-xl" muted>
          <source src={`/files/${dataMap.videoFile}`} />
        </video>
      </div>

      {/* Features Section */}
      <div>
        <h1 className="text-3xl font-semibold text-white text-center mt-20">
          {dataMap.featuresText}
        </h1>
        <p className="text-white text-center mt-4">
          {dataMap.featuresDescription}
        </p>

        <div className="grid gap-4 lg:grid-cols-[60%_40%] mt-20">
          <FeatureCard
            title={dataMap.featureHeader_1}
            description={dataMap.featureDescription_1}
            image={`/files/${dataMap.featureImage_1 || ''}`}
            bg
          />
          <FeatureCard
            title={dataMap.featureHeader_2}
            description={dataMap.featureDescription_2}
            image={`/files/${dataMap.featureImage_2 || ''}`}
          />
        </div>
        <div className="grid gap-4 lg:grid-cols-[40%_60%] mt-4">
          <FeatureCard
            title={dataMap.featureHeader_3}
            description={dataMap.featureDescription_3}
            image={`/files/${dataMap.featureImage_3 || ''}`}
          />
          <FeatureCard
            title={dataMap.featureHeader_4}
            description={dataMap.featureDescription_4}
            image={`/files/${dataMap.featureImage_4 || ''}`}
          />
        </div>
        <div className="grid gap-4 lg:grid-cols-[60%_40%] mt-4">
          <FeatureCard
            title={dataMap.featureHeader_5}
            description={dataMap.featureDescription_5}
            image={`/files/${dataMap.featureImage_5 || ''}`}
          />
          <FeatureCard
            title={dataMap.featureHeader_6}
            description={dataMap.featureDescription_6}
            image={`/files/${dataMap.featureImage_6 || ''}`}
            bg
          />
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing">
        <h1 className="text-3xl font-semibold text-white text-center mt-20">
          {t('Pricing')}
        </h1>
        <p className="text-white text-center mt-4">
          {t('Collaborate in real-time with AI and your entire product team.')}
        </p>
        <div className="flex flex-col lg:flex-row gap-4 justify-center mt-20 lg:max-w-[90%] lg:mx-auto">
          <PricingCard
            title={subscriptions?.bronzeTitle}
            description={subscriptions?.bronzeDescription}
            price={subscriptions?.bronzePrice}
            features={safeParseJSON(subscriptions?.bronzeOptions)}
          />
          <PricingCard
            title={subscriptions?.silverTitle}
            description={subscriptions?.silverDescription}
            price={subscriptions?.silverPrice}
            features={safeParseJSON(subscriptions?.silverOptions)}
          />
          {/* <PricingCard
            title={subscriptions?.goldTitle}
            description={subscriptions?.goldDescription}
            price={subscriptions?.goldPrice}
            features={safeParseJSON(subscriptions?.goldOptions)}
          /> */}
        </div>
      </div>

      {/* About Us / Customer Feedback */}
      <div id="about-us">
        <h1 className="text-3xl font-semibold text-white text-center mt-20">
          {dataMap.aboutText}
        </h1>
        <div className="mt-20 h-[600px] overflow-hidden relative">
          <div className="gradient-up h-[100px] absolute left-0 right-0 top-0 z-2"></div>
          <div className="gradient-down h-[100px] absolute left-0 right-0 bottom-0 z-2"></div>

          <div className="grid lg:grid-cols-3 gap-4" ref={customerContainer}>
            <div className="flex flex-col gap-4">
              {feedBacks.map((feedBack, index) => (
                <CustomerCard
                  key={'group_1_' + index}
                  image={feedBack.personProfile || '/assets/images/profile.svg'}
                  name={feedBack.personName}
                  tag={feedBack.personTag}
                  body={feedBack.personFeedback}
                />
              ))}
            </div>
            <div className="flex flex-col gap-4">
              {arrayShuffle(feedBacks).map((feedBack, index) => (
                <CustomerCard
                  key={'group_2_' + index}
                  image={feedBack.personProfile || '/assets/images/profile.svg'}
                  name={feedBack.personName}
                  tag={feedBack.personTag}
                  body={feedBack.personFeedback}
                />
              ))}
            </div>
            <div className="flex flex-col gap-4">
              {arrayShuffle(feedBacks).map((feedBack, index) => (
                <CustomerCard
                  key={'group_3_' + index}
                  image={feedBack.personProfile || '/assets/images/profile.svg'}
                  name={feedBack.personName}
                  tag={feedBack.personTag}
                  body={feedBack.personFeedback}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer socials={socials} />
    </div>
  )
}
