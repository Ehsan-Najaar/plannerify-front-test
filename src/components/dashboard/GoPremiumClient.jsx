'use client'

import Button from '@/components/ui/Button'
import { ME, PAYPAL_ORDER, SUBSCRIPTIONS } from '@/data/api'
import { useRequest } from '@/hooks/useRequest'
import axios from 'axios'
import moment from 'moment'
import { useEffect, useState } from 'react'

export default function GoPremiumClient() {
  const [subscriptions, setSubscriptions] = useState([])
  const [price, setPrice] = useState(null)
  const [me, setMe] = useState(null)

  const [meReq, meLoading] = useRequest({
    url: ME,
    method: 'GET',
  })

  const [paypalOrderReq, paypalOrderLoader] = useRequest({
    url: PAYPAL_ORDER,
    method: 'GET',
  })

  useEffect(() => {
    // fetch subscriptions
    axios.get(SUBSCRIPTIONS).then((r) => {
      if (Array.isArray(r.data) && r.data.length > 0) {
        setSubscriptions(JSON.parse(r.data[0]?.silverOptions || '[]'))
        setPrice(r.data[0]?.silverPrice || null)
      }
    })

    // fetch user info
    meReq().then((r) => setMe(r))
  }, [])

  const placeOrder = () => {
    paypalOrderReq().then((r) => {
      const approve = r.links?.find((l) => l.rel === 'approve')?.href
      if (approve) window.location.href = approve
    })
  }

  if (meLoading || !me) return <div>Loading...</div>

  const isPremiumActive =
    me?.plan === 'premium' && moment().isBefore(moment(me?.planExp))

  return (
    <div>
      {isPremiumActive ? (
        <>
          <div className="text-text">
            You are a premium member for{' '}
            {moment(me.planExp).diff(moment(), 'days')} days.
          </div>
          <div className="text-text text-lg font-bold my-4">
            Premium Features:
          </div>
          <ul className="list-disc list-inside mb-4 text-text">
            {subscriptions.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <h1 className="text-text text-2xl font-bold mb-4">Go Premium</h1>
          <p className="mb-4 text-text">
            Unlock all features and enhance your productivity with our Premium
            plan. Enjoy advanced tools, priority support, and exclusive content
            designed to help you achieve more.
          </p>
          <div className="text-text text-lg font-bold my-4">
            Premium Features:
          </div>
          <ul className="list-disc list-inside mb-4 text-text">
            {subscriptions.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          <Button
            onClick={placeOrder}
            loading={paypalOrderLoader}
            caption={price ? `Upgrade Now for ${price} USD` : 'Upgrade Now'}
          />
        </>
      )}
    </div>
  )
}
