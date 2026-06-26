'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import styles from './Reveal.module.css'

type Props = {
  children: ReactNode
  delay?: 1 | 2 | 3 | 4
  className?: string
}

export function Reveal({ children, delay, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      const fallback = window.setTimeout(() => setVisible(true), 0)
      return () => window.clearTimeout(fallback)
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const delayClass = delay ? styles[`delay${delay}`] : undefined

  return (
    <div ref={ref} className={[className, styles.reveal, visible && styles.visible, delayClass].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}
