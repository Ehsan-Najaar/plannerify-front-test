import { ME } from '@/data/api'
import { useRequest } from '@/hooks/useRequest'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useUserStatusCheck() {
  const router = useRouter()
  const pathname = usePathname() // reacts to path changes
  const [meReq] = useRequest({ url: ME, method: 'GET' })
  useEffect(() => {
    const checkUserStatus = async () => {
      meReq().then((user) => {
        if (user.plan === 'banned') {
          sessionStorage.removeItem('user')
          router.push('/auth/login')
        }
      })
    }

    checkUserStatus()
  }, [pathname])
}
