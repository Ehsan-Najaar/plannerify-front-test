'use client'

import { useTheme } from '@/components/context/ThemeContext'
import enGB from 'date-fns/locale/en-GB'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { toast } from 'react-toastify'

registerLocale('en-GB', enGB)

export default function CustomDateInput({
  value,
  onChange,
  isOpen,
  setIsOpen,
  disablePastDates = false,
  inlineOnly = false,
}) {
  const calendarRef = useRef(null)
  const today = new Date()
  const theme = useTheme()
  const isDard = theme === 'dark'

  const [currentMonth, setCurrentMonth] = useState(
    value ? value.getMonth() : today.getMonth()
  )
  const [currentYear, setCurrentYear] = useState(
    value ? value.getFullYear() : today.getFullYear()
  )

  const handleClickOutside = (event) => {
    if (calendarRef.current && !calendarRef.current.contains(event.target)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const CustomHeader = ({
    date,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }) => {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]

    return (
      <div className="flex items-center justify-center gap-2 text-white">
        <button
          onClick={(e) => {
            e.stopPropagation()
            decreaseMonth()
            const newDate = new Date(date.getFullYear(), date.getMonth() - 1)
            setCurrentMonth(newDate.getMonth())
            setCurrentYear(newDate.getFullYear())
          }}
          disabled={prevMonthButtonDisabled}
          className="p-1 rounded disabled:opacity-50 cursor-pointer"
        >
          <ChevronLeft className="stroke-3" />
        </button>

        <div className="text-xl font-semibold">
          {monthNames[date.getMonth()]} {date.getFullYear()}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            increaseMonth()
            const newDate = new Date(date.getFullYear(), date.getMonth() + 1)
            setCurrentMonth(newDate.getMonth())
            setCurrentYear(newDate.getFullYear())
          }}
          disabled={nextMonthButtonDisabled}
          className="p-1 rounded disabled:opacity-50 cursor-pointer"
        >
          <ChevronRight className="stroke-3" />
        </button>
      </div>
    )
  }

  const DayContents = ({ day, date }) => {
    const isPastDate =
      disablePastDates && date < new Date(today.setHours(0, 0, 0, 0))

    const isCurrentMonth =
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    const isNextMonth =
      date.getMonth() === currentMonth + 1 && date.getFullYear() === currentYear

    const isToday = date.toDateString() === new Date().toDateString()
    const isSelected = value && date.toDateString() === value.toDateString()

    const handleClick = () => {
      if (isPastDate) {
        toast.error('You cannot select a past date!')
        return
      }
      onChange(date)
      setIsOpen(false)
    }

    return (
      <div
        onClick={handleClick}
        className={`
          w-8 h-8 flex items-center justify-center rounded-full text-[13px]
          transition-colors
          ${
            isSelected
              ? 'bg-secondary text-white'
              : isToday
              ? 'bg-gray-100 text-black'
              : isPastDate
              ? 'text-gray-400 opacity-50 cursor-not-allowed'
              : isCurrentMonth
              ? 'text-text hover:bg-gray-100 hover:text-[#333] cursor-pointer'
              : 'text-gray-400'
          }
        `}
      >
        {day}
      </div>
    )
  }

  return (
    <div className="relative" ref={calendarRef}>
      {!inlineOnly && (
        <div
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(!isOpen)
          }}
          className="w-full bg-transparent h-10 text-text outline-none cursor-pointer flex items-center z-10"
        >
          {value ? value.toLocaleDateString('en-GB') : ''}
        </div>
      )}

      {isOpen && (
        <div
          className={`${
            inlineOnly ? '' : 'absolute top-full -left-2 mt-1 z-50'
          }`}
        >
          <DatePicker
            selected={value ? new Date(value) : null}
            onChange={(date) => {
              if (disablePastDates && date < new Date().setHours(0, 0, 0, 0)) {
                toast.error('You cannot select a past date!')
                return
              }

              const safeDate = new Date(date)
              safeDate.setHours(12, 0, 0, 0)
              onChange(safeDate)
              if (inlineOnly) setIsOpen(false)
              else setIsOpen(false)
            }}
            inline
            locale="en-GB"
            {...(disablePastDates && { minDate: new Date() })}
            renderCustomHeader={CustomHeader}
            renderDayContents={(day, date) => (
              <DayContents day={day} date={date} />
            )}
            calendarClassName="custom-calendar rounded-lg shadow-lg"
            dayClassName={() => 'p-1'}
            formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 3)}
            weekDayClassName={() => 'text-sm font-medium py-2'}
          />
        </div>
      )}

      <style jsx global>{`
        :global(.react-datepicker) {
          background: var(--card2) !important;
          border: none !important;
          border-radius: 20px;
          overflow: hidden;
          color: var(--text) !important;
        }

        :global(.react-datepicker__header) {
          background: linear-gradient(
            90deg,
            var(--primary),
            var(--primary-light)
          ) !important;
          height: 60px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        :global(.custom-calendar .react-datepicker__day) {
          background-color: transparent !important;
          width: 0px !important;
        }

        :global(.custom-calendar .react-datepicker__month-container) {
          width: 360px !important;
          height: 356px !important;
        }

        :global(.custom-calendar .react-datepicker__month) {
          width: 100% !important;
          display: flex !important;
          margin: 0px !important;
          flex-direction: column !important;
          gap: 2px !important;
          padding: 4px !important;
        }

        :global(.custom-calendar .react-datepicker__week) {
          display: grid !important;
          grid-template-columns: repeat(7, 1fr) !important;
          gap: 2px !important;
          width: 100% !important;
        }

        :global(.custom-calendar .react-datepicker__day-names) {
          display: grid !important;
          grid-template-columns: repeat(7, 1fr) !important;
          place-items: center !important;
          padding: 2px !important;
        }

        :global(.custom-calendar .react-datepicker__day-name) {
          color: var(--text2);
          font-weight: 500;
        }
      `}</style>
    </div>
  )
}
