'use client'

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react'
import { useEffect, useState } from 'react'

import Floating from '@/components/Floating'
import Loader from '@/components/Loader'
import Input from '@/components/ui/Input'
import { ArrowDown2 } from 'iconsax-react'
import { useTranslation } from 'react-i18next'
import '../../i18n'

export default function Select({
  options,
  selected,
  onChange,
  selectRef,
  onBlur,
  error,
  loading,
  onMore,
  onMoreCaption,
  className,
  buttonClassName,
  placeholder,
  onOpen,
  emptyMessage,
  disabled,
  noSearch,
  label,
}) {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [borderColor, setBorderColor] = useState(
    error ? 'border-red-600' : 'border-slate-400'
  )
  const [isFocused, setIsFocused] = useState(false)

  const focusHandle = () => {
    setIsFocused(true)
  }
  const blurHandle = () => {
    setIsFocused(false)
  }

  const filteredOptions =
    search === ''
      ? options
      : options.filter((option) =>
          option.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(search.toLowerCase().replace(/\s+/g, ''))
        )

  useEffect(() => {
    if (error) {
      setBorderColor('border-red-600')
    } else {
      if (isFocused) {
        setBorderColor('border-blue-600')
      } else {
        setBorderColor('border-slate-400')
      }
    }
  }, [error, isFocused])

  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open && onOpen) onOpen()
  }, [open])

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {label && <label className="mb-1 block">{label}</label>}
      <Listbox value={selected} onChange={onChange} disabled={disabled}>
        <div className="relative">
          <ListboxButton
            onBlur={onBlur}
            onClick={(e) => {
              setSearch('')
              setOpen(e.currentTarget)
            }}
            className={`relative rounded-md shadow-sm  w-full border border-solid ${borderColor} cursor-default rounded-md bg-input h-[42px] pt-1 pl-3 text-start focus:outline-none ${buttonClassName}`}
          >
            <span className="block truncate">
              {selected?.name || (
                <span className="text-slate-400">
                  {placeholder || t('Select...')}
                </span>
              )}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <div className={`transition-all ${open ? 'rotate-180' : ''}`}>
                <ArrowDown2 size={16} color="#333" />
              </div>
            </span>
          </ListboxButton>
          <Floating
            open={open}
            onClose={() => setOpen(false)}
            width={open.offsetWidth}
          >
            <div className="shadow-md">
              <ListboxOptions className="overflow-hidden z-10 px-1 w-full h-full rounded-md bg-input py-1 text-base border border-solid border-slate-200 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {loading ? (
                  <Loader className="p-6 flex justify-center" />
                ) : (
                  <div className="flex flex-col relative overflow-hidden max-h-60 h-full">
                    {options.length > 0 && !noSearch && (
                      <div
                        onKeyDown={(e) => e.stopPropagation()}
                        className="mt-1"
                      >
                        <Input
                          type="text"
                          onChange={setSearch}
                          value={search}
                          placeholder={t('Search')}
                        />
                      </div>
                    )}
                    <div className="m-1 flex-1 overflow-auto">
                      {options.length === 0 ? (
                        <span>{emptyMessage}</span>
                      ) : filteredOptions.length === 0 ? (
                        <span>{t('Not found')}</span>
                      ) : (
                        filteredOptions.map((option, index) => (
                          <ListboxOption
                            key={index}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-2 pr-2 ${
                                active
                                  ? 'bg-slate-300 bg-opacity-15 text-text!'
                                  : 'text-text'
                              }`
                            }
                            value={option}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? 'font-medium' : 'font-normal'
                                  }`}
                                >
                                  {option.name}
                                </span>
                              </>
                            )}
                          </ListboxOption>
                        ))
                      )}
                    </div>
                    {onMore && (
                      <div className="p-2 text-center border-t border-solid border-t-slate-400">
                        <button
                          className="text-sky-700 font-semibold"
                          onClick={() => {
                            onMore()
                            setOpen(false)
                          }}
                        >
                          {onMoreCaption}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </ListboxOptions>
            </div>
          </Floating>
        </div>
      </Listbox>

      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  )
}
