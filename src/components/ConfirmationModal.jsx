import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { cloneElement, useState } from 'react'

export default function ConfirmationModal({
  title,
  message,
  yesCaption,
  noCaption,
  confirmHandle,
  children,
  loading,
  open: controlledOpen,
  onClose: controlledOnClose,
}) {
  const [internalOpen, setInternalOpen] = useState(false)

  const isControlled = typeof controlledOpen === 'boolean'
  const open = isControlled ? controlledOpen : internalOpen
  const onClose = isControlled
    ? controlledOnClose
    : () => setInternalOpen(false)

  const button =
    children && !isControlled
      ? cloneElement(children, {
          onClick: () => setInternalOpen(true),
          loading,
        })
      : null

  return (
    <>
      {button}
      <Modal
        title={title}
        open={open}
        onClose={onClose}
        maxWidth={400}
        footer={
          <div className="flex gap-2">
            <Button
              onClick={() => confirmHandle().finally(onClose)}
              caption={yesCaption}
              loading={loading}
            />
            <Button outlined onClick={onClose} caption={noCaption} />
          </div>
        }
      >
        <p className="my-4">{message}</p>
      </Modal>
    </>
  )
}
