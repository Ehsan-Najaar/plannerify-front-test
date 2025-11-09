'use client'

import { PAYPAL_FINALIZE_ORDER } from '@/data/api'
import { useRequest } from '@/hooks/useRequest'
import { useEffect } from 'react'

export default function SuccessPage() {
  const [finalizeOrderReq, finalizeOrderLoader] = useRequest({
    url: PAYPAL_FINALIZE_ORDER,
    method: 'POST',
  })

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    if (token) {
      finalizeOrderReq({ token }).then((r) => {
        window.location.href = '/dashboard/go-premium'
      })
    }
  }, [])

  if (finalizeOrderLoader) {
    return <div className="text-text">Finalizing your order...</div>
  }
}
