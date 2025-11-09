'use client'

import AddEditScheduleModal from '@/app/dashboard/calendar/AddEditScheduleModal'
import CustomDateInput from '@/components/ui/CustomDateInput'
import { SCHEDULE } from '@/data/api'
import { useRequest } from '@/hooks/useRequest'
import '@/styles/calendar.css'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import { useEffect, useRef, useState } from 'react'
import { FaCheck, FaPen } from 'react-icons/fa'
import { toast } from 'react-toastify'

export default function CalendarClient({ initialSchedule }) {
  const calendarRef = useRef(null)

  // انتخاب تاریخ
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)

  // فرم رویداد
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [eventForm, setEventForm] = useState({
    id: null,
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    backgroundColor: '#851fd2',
  })

  // درخواست‌ها
  const [calendarAdd] = useRequest({ url: SCHEDULE, method: 'POST' })
  const [calendarUpdate] = useRequest({
    url: SCHEDULE + (eventForm.id ? `/${eventForm.id}` : ''),
    method: eventForm.id ? 'PUT' : 'POST',
  })
  const [calendarDelete] = useRequest({
    url: SCHEDULE + '/:id',
    method: 'DELETE',
  })

  const [events, setEvents] = useState(initialSchedule)

  // جابجایی خودکار به تاریخ انتخاب شده
  useEffect(() => {
    if (selectedDate && calendarRef.current) {
      setTimeout(() => {
        calendarRef.current?.getApi()?.gotoDate(selectedDate)
      }, 0)
    }
  }, [selectedDate])

  // شخصی‌سازی دکمه انتخاب تاریخ
  useEffect(() => {
    const button = calendarRef.current
      ?.getApi()
      .el.querySelector('.fc-myButton-button')
    if (button) {
      button.innerHTML = ''
      const img = document.createElement('img')
      img.src = '/assets/icons/choose-calendar.svg'
      img.style.width = '40px'
      img.style.height = '40px'
      button.appendChild(img)
    }
  }, [])

  // ترکیب تاریخ و ساعت برای API
  function combineDateAndTime(date, timeStr) {
    if (!timeStr) return new Date(date)
    const [time, ampm] = timeStr.split(' ')
    let [hours, minutes] = time.split(':').map(Number)
    if (ampm === 'PM' && hours < 12) hours += 12
    if (ampm === 'AM' && hours === 12) hours = 0
    const newDate = new Date(date)
    newDate.setHours(hours, minutes, 0, 0)
    return newDate
  }

  // تابع کم‌کننده روشنایی رنگ
  function darkenColor(hex, amount = 20) {
    let col = hex.startsWith('#') ? hex.slice(1) : hex
    const num = parseInt(col, 16)

    let r = (num >> 16) - amount
    let g = ((num >> 8) & 0x00ff) - amount
    let b = (num & 0x0000ff) - amount

    r = r < 0 ? 0 : r
    g = g < 0 ? 0 : g
    b = b < 0 ? 0 : b

    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
  }

  function formatTimeAMPM(date) {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const formattedHours = hours % 12 || 12
    const formattedMinutes = minutes.toString().padStart(2, '0')
    return `${formattedHours}:${formattedMinutes} ${ampm}`
  }

  // افزودن رویداد
  const handleSaveEvent = async () => {
    if (!eventForm.title || !eventForm.startTime || !eventForm.endTime) {
      toast.error('Please fill in Title, Start Time, and End Time!')
      return
    }
    if (!selectedDate) {
      toast.error('Please select a date!')
      return
    }

    const newEvent = {
      title: eventForm.title,
      description: eventForm.description,
      start: combineDateAndTime(selectedDate, eventForm.startTime),
      end: combineDateAndTime(selectedDate, eventForm.endTime),
      backgroundColor: eventForm.backgroundColor || '#2196f3',
    }

    try {
      await calendarAdd(newEvent)
      setEvents((prev) => [...prev, { id: Date.now(), ...newEvent }])
      resetForm()
      toast.success('Event added successfully!')
    } catch (error) {
      console.error('❌ Failed to add event!', error)
      toast.error('Failed to add event!')
    }
  }

  // ویرایش رویداد
  const handleUpdateEvent = async () => {
    if (!eventForm.id) {
      toast.error('Event ID is missing!')
      console.error('❌ Missing eventForm.id')
      return
    }

    const start = combineDateAndTime(selectedDate, eventForm.startTime)
    const end = combineDateAndTime(selectedDate, eventForm.endTime)

    const payload = {
      title: eventForm.title,
      description: eventForm.description,
      start,
      end,
      backgroundColor: eventForm.backgroundColor,
    }

    try {
      await calendarUpdate(payload)
      toast.success('Event updated successfully!')

      // بروزرسانی state محلی
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === eventForm.id ? { ...ev, ...payload, id: eventForm.id } : ev
        )
      )

      // بروزرسانی مستقیم FullCalendar
      const calendarApi = calendarRef.current?.getApi()
      const updatedEvent = calendarApi?.getEventById(eventForm.id)
      if (updatedEvent) {
        updatedEvent.setProp('title', payload.title)
        updatedEvent.setExtendedProp('description', payload.description)
        updatedEvent.setStart(payload.start)
        updatedEvent.setEnd(payload.end)
        updatedEvent.setProp('backgroundColor', payload.backgroundColor)
      }

      resetForm()
    } catch (err) {
      console.error('❌ Update failed!', err)
      toast.error('Failed to update event!')
    }
  }

  // حذف رویداد
  const handleDeleteEvent = async (eventId) => {
    try {
      console.log('🟡 Attempting to delete event with ID:', eventId)

      await calendarDelete(null, { id: eventId })

      // حذف از state محلی
      setEvents((prev) => prev.filter((ev) => ev.id !== eventId))

      // حذف مستقیم از FullCalendar
      const calendarApi = calendarRef.current?.getApi()
      const event = calendarApi?.getEventById(eventId)
      if (event) event.remove()

      resetForm()
      toast.success('Event deleted successfully!')
    } catch (err) {
      console.error('❌ Failed to delete event!', err)
      toast.error('Failed to delete event!')
    }
  }

  // ریست فرم
  const resetForm = () => {
    setIsEventModalOpen(false)
    setEventForm({
      id: null,
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      backgroundColor: '#2196f3',
    })
  }

  return (
    <div className="min-h-[calc(100vh-32px)] border-2 border-border shadow p-4 rounded-lg bg-card relative">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{ left: 'prev,next title', right: 'myButton' }}
        allDaySlot={false}
        scrollTime="00:00:00"
        slotMinTime="00:00:00"
        slotMaxTime="23:00:00"
        slotDuration="02:00:00"
        slotLabelFormat={{
          hour: 'numeric',
          meridiem: 'short',
        }}
        customButtons={{
          myButton: {
            text: '',
            click: () => setIsModalOpen(true),
          },
        }}
        dateClick={(info) => {
          setSelectedDate(new Date(info.date))
          setIsEventModalOpen(true)
        }}
        eventClick={(info) => {
          const event = info.event
          setEventForm({
            id: event.id,
            title: event.title,
            description: event.extendedProps.description || '',
            startTime: formatTime(event.start),
            endTime: formatTime(event.end),
            backgroundColor: event.backgroundColor || '#2196f3',
          })
          setSelectedDate(new Date(event.start))
          setIsEventModalOpen(true)
        }}
        events={events}
        editable={false}
        selectable={true}
        dayHeaderFormat={{ weekday: 'short' }}
        firstDay={1}
        height="720px"
        eventContent={(arg) => {
          const bg = arg.event.backgroundColor
          const border = darkenColor(bg, 25)

          return (
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative h-full text-white rounded-md flex flex-col items-center justify-center"
              style={{
                backgroundColor: bg,
                border: `2px solid ${border}`,
              }}
            >
              {/* چک باکس بالا چپ */}
              <label
                className="absolute top-2 left-2 cursor-pointer z-10 flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <input type="checkbox" className="peer hidden" />
                <div className="w-5 h-5 rounded-full border-2 border-white"></div>
                <FaCheck className="absolute text-white text-[12px] hidden peer-checked:block" />
              </label>

              {/* آیکون مداد بالا راست */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  const event = arg.event
                  setEventForm({
                    id: event.id,
                    title: event.title,
                    description: event.extendedProps.description || '',
                    startTime: formatTime(event.start),
                    endTime: formatTime(event.end),
                    backgroundColor: event.backgroundColor || '#2196f3',
                  })
                  setSelectedDate(new Date(event.start))
                  setIsEventModalOpen(true)
                }}
                className="absolute top-2 right-2 text-white text-[13px] hover:opacity-80 cursor-pointer"
              >
                <FaPen size={18} className="p-px" />
              </button>

              {/* عنوان و زمان */}
              <div className="flex flex-col items-center justify-center mt-2">
                <div className="text-lg font-semibold text-center leading-tight">
                  {arg.event.title}
                </div>
                <div className="text-xs font-medium mt-1">
                  {`${formatTimeAMPM(arg.event.start)} - ${formatTimeAMPM(
                    arg.event.end
                  )}`}
                </div>
              </div>
            </div>
          )
        }}
      />

      <AddEditScheduleModal
        isOpen={isEventModalOpen}
        onClose={resetForm}
        onSave={eventForm.id ? handleUpdateEvent : handleSaveEvent}
        onDelete={() => handleDeleteEvent(eventForm.id)}
        eventForm={eventForm}
        setEventForm={setEventForm}
        isEdit={!!eventForm.id}
        selectedDate={selectedDate}
      />

      {isModalOpen && (
        <div className="fixed top-20 right-9 z-40">
          <CustomDateInput
            value={selectedDate}
            onChange={(date) => {
              setSelectedDate(date)
              setIsModalOpen(false)
            }}
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
            inlineOnly
          />
        </div>
      )}
    </div>
  )
}

// تبدیل زمان به فرمت 12 ساعته
function formatTime(date) {
  if (!date) return ''
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const formattedHours = hours % 12 || 12
  return `${String(formattedHours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0'
  )} ${ampm}`
}
