'use client'

import { useTheme } from '@/components/context/ThemeContext'
import Link from 'next/link'

export default function Button({
  caption,
  size,
  className,
  href,
  type = 'primary',
  outlined,
  onClick,
  loading,
  download,
}) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const showGradient = type === 'primary' && !outlined

  return (
    <Link
      onClick={(e) => {
        if (onClick) {
          e.preventDefault()
          onClick()
        }
      }}
      href={href || '#'}
      download={download}
      className={`font-medium h-10 gap-4 cursor-pointer rounded-full flex justify-center items-center w-fit px-6 transition-all
        ${size === 'small' ? 'text-sm h-8' : ''}
        ${type === 'gray' ? 'bg-gray-300 text-gray-800 hover:bg-gray-400' : ''}
        ${
          outlined
            ? `border-3 border-solid ${
                isDark
                  ? 'border-primary-light text-primary-light'
                  : 'border-primary text-primary'
              }`
            : ''
        }
        ${
          type === 'primary' && !outlined
            ? 'text-white bg-linear-to-t from-primary to-125% to-primary-light'
            : ''
        }
        
        ${className || ''}`}
    >
      {loading && <div className="dot-loader absolute"></div>}
      <span className={`${loading ? 'invisible' : ''}`}>{caption}</span>
    </Link>
  )
}

export function TextButton({
  caption,
  size,
  className,
  href,
  leftIcon,
  rightIcon,
  onClick,
}) {
  return (
    <Link
      onClick={(e) => {
        if (onClick) {
          e.preventDefault()
          onClick()
        }
      }}
      href={href || '#'}
      className={`text-primary cursor-pointer hover:underline font-medium flex gap-2 justify-center items-center w-fit transition-all
        ${size === 'small' ? 'text-sm h-8' : ''}
        ${className || ''}`}
    >
      {leftIcon || null}
      {caption}
      {rightIcon || null}
    </Link>
  )
}
