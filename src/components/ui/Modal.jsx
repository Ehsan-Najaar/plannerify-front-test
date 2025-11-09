import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import Image from 'next/image'

export default function Modal({
  title,
  description,
  open,
  icon,
  onClose,
  children,
  maxWidth,
  footer,
}) {
  return (
    <Dialog open={open} onClose={() => {}} className="z-50 fixed inset-0">
      <div
        className="fixed inset-0 bg-black/30"
        onClick={(e) => e.stopPropagation()}
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className="flex flex-col gap-3 overflow-hidden max-h-[calc(100vh-30px)] w-full bg-card shadow-sm shadow-primary text-text p-4 md:p-6 duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
          style={{ maxWidth }}
        >
          <DialogTitle>
            <div className="flex items-center font-semibold text-lg">
              <div className="flex items-center gap-3">
                {icon && (
                  <Image src={icon} alt={title} width={28} height={28} />
                )}
                <h1 className="flex-1 text-xl">{title}</h1>
              </div>
            </div>
          </DialogTitle>
          <div>{description}</div>
          <div className="flex flex-col flex-1 overflow-auto mt-4 px-4 custom-scroll">
            {children}
          </div>
          {footer && <div className="mt-6">{footer}</div>}
        </DialogPanel>
      </div>
    </Dialog>
  )
}
