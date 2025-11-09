import { useStore } from '@/components/context/ClientProvider'
import { HambergerMenu } from 'iconsax-react'

export default function MobileHeader() {
  const { store, setStore } = useStore()

  return (
    <div className="flex lg:hidden fixed left-0 right-0 top-0 h-12 bg-white px-6">
      <button onClick={() => setStore({ ...store, sidebar: true })}>
        <HambergerMenu size={20} color="black" />
      </button>
    </div>
  )
}
