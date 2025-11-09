'use client'

import { useTheme } from '@/components/context/ThemeContext'
import CustomDateInput from '@/components/ui/CustomDateInput'
import { Eye, EyeSlash } from 'iconsax-react'
import { CalendarCheck } from 'lucide-react'
import { useState } from 'react'

export default function Input({
  label,
  icon,
  type,
  value,
  placeholder,
  onChange,
  onClick,
  minLength,
  maxLength,
  error,
  onFocus,
  disabled,
  onEnter,
  className,
  multiLine,
}) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [passwordShow, setPasswordShow] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [focused, setFocused] = useState(false)

  return (
    <div className={`${className || ''}`}>
      {label && (
        <label className="mb-1 block font-semibold text-lg">{label}</label>
      )}

      {/* ورودی‌ها */}
      <div
        className={`relative bg-transparent flex items-center gap-4 hover:border-primary-500 duration-300 ${
          focused && !error ? '!solid-shadow border-primary-500!' : ''
        } ${error ? 'border-red-500!' : ''}`}
      >
        {icon && <div className="text-secondary-300">{icon}</div>}

        {/* textarea */}
        {multiLine ? (
          <textarea
            className="placeholder:text-secondary-300 flex-1 outline-none w-full h-[140px] py-2 px-3 border border-border rounded-lg bg-transparent resize-none"
            value={value ?? ''}
            onChange={onChange}
            placeholder={placeholder}
            onBlur={() => setFocused(false)}
            onFocus={(e) => {
              setFocused(true)
              onFocus?.(e)
            }}
            disabled={disabled}
            onKeyUp={(e) => e.key === 'Enter' && onEnter?.()}
          />
        ) : type === 'password' ? (
          // password
          <div className="flex items-center w-full relative">
            <input
              className="placeholder:text-secondary-300 flex-1 outline-none w-full h-10 bg-transparent border-b border-border pr-8"
              type={passwordShow ? 'text' : 'password'}
              value={value ?? ''}
              onChange={onChange}
              placeholder={placeholder}
              onBlur={() => setFocused(false)}
              onFocus={(e) => {
                setFocused(true)
                onFocus?.(e)
              }}
              disabled={disabled}
              onKeyUp={(e) => e.key === 'Enter' && onEnter?.()}
            />
            <button
              type="button"
              onClick={() => setPasswordShow(!passwordShow)}
              className="absolute right-0 text-slate-700"
            >
              {passwordShow ? <EyeSlash /> : <Eye />}
            </button>
          </div>
        ) : type === 'date' ? (
          // date
          <div className="relative w-full">
            {/* فیلد ورودی نمایشی */}
            <div
              onClick={() => setShowCalendar(!showCalendar)}
              className="w-full border-b border-border bg-transparent h-10 text-text outline-none cursor-pointer flex items-center px-2"
            >
              {/* نمایش تقویم */}
              <CustomDateInput
                value={value ? new Date(value) : null}
                isOpen={showCalendar}
                setIsOpen={setShowCalendar}
                disablePastDates={true}
                onChange={(date) => {
                  onChange({
                    target: { value: date.toISOString().split('T')[0] },
                  })
                  setShowCalendar(false)
                }}
              />

              <span
                className={`ml-auto ${
                  isDark ? 'text-primary-light' : 'text-primary'
                }`}
              >
                <CalendarCheck />
              </span>
            </div>
          </div>
        ) : (
          // input معمولی
          <input
            className="placeholder:text-secondary-300 flex-1 outline-none w-full h-10 bg-transparent border-b border-border"
            type={type || 'text'}
            value={value ?? ''}
            onChange={onChange}
            onClick={onClick}
            placeholder={placeholder}
            minLength={minLength}
            maxLength={maxLength}
            onBlur={() => setFocused(false)}
            onFocus={(e) => {
              setFocused(true)
              onFocus?.(e)
            }}
            disabled={disabled}
            onKeyUp={(e) => e.key === 'Enter' && onEnter?.()}
          />
        )}
      </div>

      {/* ارور */}
      {error && (
        <div className="text-red-500 text-[0.8125rem] leading-4.5 flex gap-2 items-center mt-1">
          <div>{error}</div>
        </div>
      )}
    </div>
  )
}
