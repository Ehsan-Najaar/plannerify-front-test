'use client'

import ConfirmationModal from '@/components/ConfirmationModal'
import { useTheme } from '@/components/context/ThemeContext'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useEffect, useRef, useState } from 'react'
import { FaClock, FaTrash } from 'react-icons/fa'
import {
  IoMdColorPalette,
  IoMdNotifications,
  IoMdNotificationsOff,
} from 'react-icons/io'

// ---------- TIME PICKER MODAL ----------
export function TimePickerModal({ isOpen, onClose, onSelect, initialTime }) {
  const { theme } = useTheme?.() || {}
  const isDark = theme === 'dark'

  const itemHeight = 56
  const visibleCount = 3 // تعداد آیتم‌های قابل دیدن در viewport

  const [hour, setHour] = useState(initialTime?.hour || 1)
  const [minute, setMinute] = useState(initialTime?.minute || 0)
  const [ampm, setAmPm] = useState(initialTime?.ampm || 'AM')

  const hoursRef = useRef(null)
  const minutesRef = useRef(null)

  // اضافه کردن padding خالی اول و آخر
  const hours = ['--', ...Array.from({ length: 12 }, (_, i) => i + 1), '--']
  const minutes = ['--', ...Array.from({ length: 60 }, (_, i) => i), '--']

  useEffect(() => {
    if (!isOpen) return

    document.body.style.overflow = 'hidden'

    const initialHourIndex = hours.indexOf(initialTime?.hour || 1)
    const initialMinuteIndex = minutes.indexOf(initialTime?.minute || 0)

    scrollToCenter(hoursRef.current, initialHourIndex)
    scrollToCenter(minutesRef.current, initialMinuteIndex)
  }, [isOpen])

  const scrollToCenter = (ref, index) => {
    if (!ref) return
    const scrollIndex = index + 1
    const offset =
      scrollIndex * itemHeight - Math.floor(visibleCount / 2) * itemHeight
    ref.scrollTo({ top: offset, behavior: 'smooth' })
  }

  const handleDone = () => {
    const h = hour < 10 ? `0${hour}` : hour
    const m = minute < 10 ? `0${minute}` : minute
    onSelect(`${h}:${m} ${ampm}`)
    onClose()
  }

  const handleScroll = (e, type) => {
    const ref = e.target
    const scrollTop = ref.scrollTop
    let newIndex = Math.round(scrollTop / itemHeight)

    // محدود کردن به index های واقعی (1 تا length-2) یعنی فقط مقادیر غیر null
    const maxIndex = type === 'hour' ? hours.length - 2 : minutes.length - 2
    const minIndex = 1
    if (newIndex < minIndex) newIndex = minIndex
    if (newIndex > maxIndex) newIndex = maxIndex

    if (type === 'hour') setHour(hours[newIndex])
    else setMinute(minutes[newIndex])
  }

  const handleClickItem = (type, value) => {
    if (value === null) return
    const index =
      type === 'hour' ? hours.indexOf(value) : minutes.indexOf(value)
    const ref = type === 'hour' ? hoursRef.current : minutesRef.current
    scrollToCenter(ref, index)
  }

  const renderScrollList = (numbers, value, type) => {
    const paddedNumbers = [null, ...numbers, null] // padding اول و آخر
    const itemHeight = 56
    const containerHeight = itemHeight * 3
    const valueIndex = numbers.indexOf(value) + 1 // +1 به خاطر padding

    return (
      <div className="relative w-16" style={{ height: `${containerHeight}px` }}>
        {/* overlay وسط - الان زیر آیتم‌ها */}
        <div
          className={`absolute left-0 right-0 ${
            type === 'hour'
              ? isDark
                ? 'bg-[#4A0082] rounded-xs'
                : 'bg-[#EFDAFF] rounded-xs'
              : ''
          } pointer-events-none`}
          style={{
            top: `${itemHeight}px`,
            height: `${itemHeight}px`,
            zIndex: 0,
          }}
        />

        <div
          ref={type === 'hour' ? hoursRef : minutesRef}
          className="h-full overflow-y-scroll scroll-smooth snap-y snap-mandatory hide-scrollbar relative z-10"
          onScroll={(e) => handleScroll(e, type)}
        >
          {paddedNumbers.map((n, idx) => {
            const isCenter = idx === valueIndex
            return (
              <div
                key={idx}
                onClick={() => n !== null && handleClickItem(type, n)} // فقط وقتی n واقعی است
                className={`flex items-center justify-center snap-start transition-all duration-200 ${
                  n !== null ? 'cursor-pointer' : 'cursor-default'
                }`}
                style={{
                  height: `${itemHeight}px`,
                  fontWeight: isCenter ? 'normal' : 'normal',
                  fontSize: isCenter ? '40px' : '22px',
                  color:
                    n === null
                      ? 'transparent'
                      : isCenter
                      ? type === 'hour'
                        ? isDark
                          ? '#A78BFA'
                          : '#8C0BED'
                        : isDark
                        ? ''
                        : '#333'
                      : '#9ca3af',
                  position: 'relative',
                }}
              >
                {n === null ? '' : n < 10 ? `0${n}` : n}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-card2 text-text rounded-2xl shadow-xl w-[328px] max-w-[90%] transition-all overflow-hidden`}
      >
        <div className="p-5 flex flex-col gap-5 items-center">
          <div className="flex items-center gap-2">
            {/* ساعت */}
            {renderScrollList(hours, hour, 'hour')}

            {/* علامت : */}
            <div className="text-4xl font-bold select-none">:</div>

            {/* دقیقه */}
            {renderScrollList(minutes, minute, 'minute')}

            {/* خط جداکننده قبل AM/PM */}
            <div className="w-0.5 h-32 bg-border mx-2 rounded-sm"></div>

            {/* AM/PM */}
            <div className="w-20 flex flex-col border-2 rounded-md overflow-hidden border-primary">
              {['PM', 'AM'].map((ap) => (
                <div
                  key={ap}
                  onClick={() => setAmPm(ap)}
                  className={`h-16 flex items-center justify-center cursor-pointer text-4xl font-bold transition-colors duration-200 ${
                    ap === ampm
                      ? isDark
                        ? 'bg-[#4A0082] text-[#A78BFA]'
                        : 'bg-[#EFDAFF] text-[#8C0BED]'
                      : 'bg-transparent text-primary'
                  }`}
                >
                  {ap}
                </div>
              ))}
            </div>
          </div>

          {/* دکمه‌ها */}
          <div className="flex gap-3 my-1">
            <Button caption={'Done'} onClick={handleDone} size={'small'} />

            <Button
              caption={'Cancel'}
              onClick={onClose}
              size={'small'}
              outlined
              className={'bg-white'}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------- MAIN MODAL ----------
export default function AddEditScheduleModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  eventForm,
  setEventForm,
  isEdit = false,
  selectedDate,
}) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [timePickerOpen, setTimePickerOpen] = useState(false)
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const [notify, SetNotify] = useState(true)
  const [timeField, setTimeField] = useState('startTime')
  const [confirmOpen, setConfirmOpen] = useState(false)

  const openTimePicker = (field) => {
    setTimeField(field)
    setTimePickerOpen(true)
  }

  const handleTimeSelect = (time) => {
    const updatedField = timeField
    const newEventForm = { ...eventForm, [updatedField]: time }

    if (selectedDate) {
      const [hours, minutes] = time.split(' ')[0].split(':').map(Number)
      const ampm = time.split(' ')[1]
      let h = hours
      if (ampm === 'PM' && hours < 12) h += 12
      if (ampm === 'AM' && hours === 12) h = 0
      const newDate = new Date(selectedDate)
      newDate.setHours(h, minutes, 0, 0)

      if (updatedField === 'startTime') newEventForm.start = newDate
      if (updatedField === 'endTime') newEventForm.end = newDate
    }

    setEventForm(newEventForm)
  }

  const handleSave = () => {
    onSave(eventForm)
    setEventForm({
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      backgroundColor: '#a855f7',
    })
  }

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  }, [isOpen])

  if (!isOpen) return null

  // 🎨 رنگ‌های سفارشی
  const COLORS = [
    { name: 'Tomato', hex: '#FF453A' },
    { name: 'Tangerine', hex: '#FF9500' },
    { name: 'Banana', hex: '#FFD60A' },
    { name: 'Basil', hex: '#30D158' },
    { name: 'Sage', hex: '#34C759' },
    { name: 'Peacock', hex: '#5AC8FA' },
    { name: 'Blueberry', hex: '#5856D6' },
    { name: 'Lavender', hex: '#BF5AF2' },
    { name: 'Grape', hex: '#AF52DE' },
    { name: 'Flamingo', hex: '#FF3B30' },
    { name: 'Graphite', hex: '#8E8E93' },
  ]

  return (
    <>
      {/* ---- Main Add/Edit Modal ---- */}
      <div
        className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 animate-fade-in"
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`bg-card2 text-text rounded-xl shadow-lg w-[415px] max-w-[90%] overflow-hidden relative`}
        >
          {/* ---- Header ---- */}
          <div className="flex items-center justify-between bg-linear-to-r from-primary to-[#C389EF] text-white p-4">
            <h2 className="text-2xl font-bold">
              {isEdit ? 'Edit a task' : 'Add a task'}
            </h2>

            {isEdit && (
              <button
                onClick={() => setConfirmOpen(true)}
                className="p-2 cursor-pointer"
                title="Delete this task"
              >
                <FaTrash size={24} />
              </button>
            )}
          </div>

          {/* ---- Body ---- */}
          <div className="flex flex-col gap-4 pt-3 px-4 pb-7.5 relative">
            {isEdit && (
              <div
                className={`text-center text-sm ${
                  isDark ? 'text-primary-light' : 'text-primary'
                }`}
              >
                Editing existing task
              </div>
            )}

            <div className={`space-y-9  ${isEdit ? '-mt-4' : ''}`}>
              <Input
                label="Task name"
                value={eventForm.title}
                maxLength={24}
                onChange={(e) =>
                  setEventForm({ ...eventForm, title: e.target.value })
                }
                name="title"
              />

              <Input
                label="Task Description"
                multiLine
                value={eventForm.description}
                onChange={(e) =>
                  setEventForm({ ...eventForm, description: e.target.value })
                }
                name="description"
              />
            </div>

            <div className="flex gap-8 items-center">
              {['startTime', 'endTime'].map((field, idx) => (
                <div
                  key={field}
                  onClick={() => openTimePicker(field)}
                  className="space-y-4 cursor-pointer"
                >
                  <section className="flex items-center justify-center gap-2">
                    <p className="font-semibold text-lg">
                      {idx === 0 ? 'From' : 'To'}
                    </p>
                    <FaClock
                      size={32}
                      className={`${
                        isDark ? 'text-primary-light' : 'text-primary'
                      }`}
                    />
                  </section>
                  <input
                    type="text"
                    readOnly
                    value={eventForm[field]}
                    className="w-full border-b border-border text-center focus:outline-none py-2 cursor-pointer"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-around my-6">
              <label
                onClick={() => {
                  SetNotify(!notify)
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <span className="text-lg font-semibold">Notify</span>
                {notify ? (
                  <IoMdNotifications
                    size={32}
                    className={`${
                      isDark ? 'text-primary-light' : 'text-primary'
                    }`}
                  />
                ) : (
                  <IoMdNotificationsOff
                    size={32}
                    className={`${
                      isDark ? 'text-primary-light' : 'text-primary'
                    }`}
                  />
                )}
              </label>

              {/* 🎨 دکمه باز کردن پالت رنگ */}
              <div className="flex items-center justify-center">
                <label
                  onClick={() => setColorPickerOpen(true)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-lg font-semibold">Color</span>
                  <IoMdColorPalette
                    size={32}
                    style={{ color: eventForm.backgroundColor }}
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-4">
              <Button
                onClick={handleSave}
                caption={isEdit ? 'Update' : 'Done'}
              />
              <Button
                onClick={onClose}
                caption="Cancel"
                outlined
                className={'bg-white'}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ---- Color Picker Modal ---- */}
      {colorPickerOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/40 z-60 animate-fade-in"
          onClick={() => setColorPickerOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`bg-card2 text-text rounded-xl shadow-lg p-6 w-[210px] flex flex-col gap-3 overflow-y-auto`}
          >
            {COLORS.map((c) => (
              <button
                key={c.name}
                onClick={() => {
                  setEventForm({
                    ...eventForm,
                    backgroundColor: c.hex,
                  })
                  setColorPickerOpen(false)
                }}
                className="flex items-center gap-3 p-2 rounded-md text-lg cursor-pointer hover:bg-gray transition-all duration-300"
              >
                <span
                  className="w-5 h-5 rounded-full border-7"
                  style={{
                    borderColor: c.hex,
                    backgroundColor:
                      eventForm.backgroundColor === c.hex
                        ? c.hex
                        : 'transparent',
                  }}
                ></span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ---- Time Picker Modal ---- */}
      <TimePickerModal
        isOpen={timePickerOpen}
        onClose={() => setTimePickerOpen(false)}
        onSelect={handleTimeSelect}
        initialTime={
          timeField === 'startTime'
            ? parseTime(eventForm.startTime)
            : parseTime(eventForm.endTime)
        }
      />

      {/* ---- Confirmation Modal ---- */}
      <ConfirmationModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete task"
        message="Are you sure you want to delete this task?"
        yesCaption="delete"
        noCaption="Cancel"
        confirmHandle={() => onDelete(eventForm.id)}
      />
    </>
  )
}

// ---------- HELPER ----------
function parseTime(timeStr) {
  if (!timeStr) return { hour: 12, minute: 0, ampm: 'AM' }
  const [time, ampm] = timeStr.split(' ')
  const [hour, minute] = time.split(':').map(Number)
  return { hour, minute, ampm }
}
