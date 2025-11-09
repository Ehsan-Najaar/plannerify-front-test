import { cloneElement, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

export default function Floating({ children, open, onClose, width }) {
  const rootRef = useRef()
  const containerRef = useRef()
  const accessableChild = cloneElement(children, { ref: containerRef })

  const getAbsPosition = (el) => {
    var elWidth = el.offsetWidth
    var elHeight = el.offsetHeight
    var el2 = el
    var curtop = 0
    var curleft = 0
    if (document.getElementById || document.all) {
      do {
        curleft += el.offsetLeft - el.scrollLeft
        curtop += el.offsetTop - el.scrollTop
        el = el.offsetParent
        el2 = el2.parentNode
        while (el2 != el) {
          curleft -= el2.scrollLeft
          curtop -= el2.scrollTop
          el2 = el2.parentNode
        }
      } while (el.offsetParent)
    } else if (document.layers) {
      curtop += el.y
      curleft += el.x
    }
    return {
      top: curtop,
      bottom: elHeight + curtop,
      right: elWidth + curleft,
      left: curleft,
    }
  }

  useEffect(() => {
    if (open) {
      containerRef.current.style.right = null
      containerRef.current.style.left = null
      containerRef.current.style.top = null
      containerRef.current.style.bottom = null

      let top, bottom, left, right

      containerRef.current.style.position = 'absolute'
      containerRef.current.style.overflow = 'auto'
      containerRef.current.style.width = width + 'px' || null

      const elemPos = getAbsPosition(open)
      const containerPos = containerRef.current.getBoundingClientRect()

      if (window.innerHeight - elemPos.bottom > elemPos.top) {
        top = elemPos.bottom + 10 + 'px'
        if (window.innerHeight - elemPos.bottom > containerPos.height) {
          bottom = null
        } else {
          bottom = -window.innerHeight + 20 + 'px'
        }
      } else {
        bottom = -elemPos.top + 10 + 'px'
        if (elemPos.top > containerPos.height) {
          top = null
        } else {
          top = 20 + 'px'
        }
      }

      let offset = elemPos.right - containerPos.width
      if (window.innerWidth - 40 < containerPos.width) {
        right = 20 + 'px'
        left = 20 + 'px'
      } else {
        if (offset < 20) {
          right = window.innerWidth - elemPos.right + offset - 20 + 'px'
        } else {
          right = window.innerWidth - elemPos.right + 'px'
        }
      }

      containerRef.current.style.top = top
      containerRef.current.style.bottom = bottom
      containerRef.current.style.right = right
      containerRef.current.style.left = left

      document.getElementById('floating').classList.add('open')
    } else {
      document.getElementById('floating').classList.remove('open')
    }
  }, [open, containerRef])

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        onClose && onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [containerRef])

  useEffect(() => {
    const scrollHider = (e) => {
      if (!document.querySelector('#floating').contains(e.target)) {
        onClose && onClose()
      }
    }

    document.addEventListener('scroll', scrollHider, true)

    return () => {
      window.removeEventListener('scroll', scrollHider, true)
      rootRef?.current?.remove()
    }
  }, [])

  if (!children || !open) return null
  return ReactDOM.createPortal(
    <div>{accessableChild}</div>,
    document.getElementById('floating')
  )
}
