'use client'

import { useStore } from '@/components/context/ClientProvider'
import axios from 'axios'
import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

function replaceUrlParams(url, params) {
  return url.replace(/:(\w+)/g, (_, key) =>
    params[key] !== undefined ? params[key] : `:${key}`
  )
}

export function useRequest({
  url,
  method = 'get',
  token,
  loaderInitState = false,
  multipart = false,
  moreConfigs,
}) {
  const [loading, setLoading] = useState(loaderInitState)
  const [cancel, setCancel] = useState(null)
  const { store, setStore } = useStore()
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://plannerify.io/api'

  const response = useCallback(
    async (data, params) => {
      const CancelToken = axios.CancelToken
      setLoading(true)

      const finalUrl = params ? replaceUrlParams(url, params) : url
      const fullUrl = finalUrl.startsWith('http')
        ? finalUrl
        : `${baseUrl}${finalUrl}`

      try {
        const res = await axios({
          method,
          url: fullUrl,
          data: method.toLowerCase() !== 'get' ? data : undefined,
          params: method.toLowerCase() === 'get' ? data : undefined,
          cancelToken: new CancelToken((c) => setCancel(() => c)),
          headers: {
            ...(token || store?.user?.accessToken
              ? { Authorization: `Bearer ${token || store?.user?.accessToken}` }
              : {}),
            ...(multipart ? { 'Content-Type': 'multipart/form-data' } : {}),
          },
          withCredentials: true,
          ...(moreConfigs || {}),
        })

        setLoading(false)
        return res.data
      } catch (e) {
        setLoading(false)

        if (e.code === 'ERR_NETWORK') {
          toast.error('Server communication error!')
          return Promise.reject(e)
        }

        if (e.code === 'ERR_CANCELED') return

        if (e.response) {
          const { status, data: errData } = e.response

          if (status === 403) {
            sessionStorage.removeItem('user')
            setStore?.((prev) => ({ ...prev, user: undefined }))
            toast.error('Your session has expired. Please login again.')
          } else {
            toast.error(errData?.message || 'Request failed!')
          }
        } else {
          toast.error('Unexpected server error. Please try again.')
        }

        return Promise.reject(e)
      }
    },
    [url, method, token, multipart, moreConfigs, baseUrl, store, setStore]
  )

  return [response, loading, cancel]
}
