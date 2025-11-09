import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { Trash } from 'iconsax-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import '../../../../../i18n'

export default function AddEditSubModal({ open, onClose }) {
  const [form, setForm] = useState({
    options: [],
  })

  const [formErr, setFormErr] = useState({})
  const { t } = useTranslation()

  const submitForm = () => {}

  return (
    <Modal
      title={t('Add / Edit Subscription')}
      open={open}
      onClose={onClose}
      maxWidth={500}
      footer={
        <div className="flex gap-2 items-center justify-end">
          <Button
            caption={t('Save')}
            onClick={submitForm}
            // loading={ideaAddEditLoader}
          />
          <Button caption={t('Cancel')} outlined onClick={onClose} />
        </div>
      }
    >
      <Input
        label={t('Title')}
        placeholder={t('Enter idea title')}
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        onFocus={() => setFormErr({ ...formErr, title: '' })}
        error={formErr.title}
      />
      <div className="mt-4 flex flex-col gap-2">
        {form.options.map((option, index) => (
          <div className="flex items-center gap-4" key={'option-' + index}>
            <Input
              label={t('Option')}
              placeholder={t('Enter an Option')}
              value={option}
              onChange={(e) =>
                setForm({
                  ...form,
                  options: form.options.map((o, i) =>
                    i === index ? e.target.value : o
                  ),
                })
              }
              className="flex-1"
            />
            <button
              className="w-fit flex items-center justify-center mt-6"
              onClick={() =>
                setForm({
                  ...form,
                  options: form.options.filter((o, i) => i !== index),
                })
              }
            >
              <Trash size={16} color="red" />
            </button>
          </div>
        ))}
      </div>
      <Button
        size="small"
        outlined
        caption={t('Add new option')}
        onClick={() => setForm({ ...form, options: [...form.options, ''] })}
        className="mt-4"
      />
      <div className="mt-4 flex flex-col gap-2">
        <Checkbox label={t('User can access to tasks')} />
        <Checkbox label={t('User can access to ideas')} />
        <Checkbox label={t('User can access to goals')} />
        <Checkbox label={t('User can access to plans')} />
        <Checkbox label={t('User receives notifications')} />
      </div>
    </Modal>
  )
}
