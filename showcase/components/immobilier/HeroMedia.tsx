'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from './home.module.css'

type MotionState = 'checking' | 'normal' | 'reduced' | 'error'

export function HeroMedia() {
  const [motionState, setMotionState] = useState<MotionState>('checking')
  const [videoReady, setVideoReady] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionState = () => {
      setVideoReady(false)
      setMotionState(mediaQuery.matches ? 'reduced' : 'normal')
    }

    updateMotionState()
    mediaQuery.addEventListener('change', updateMotionState)

    return () => mediaQuery.removeEventListener('change', updateMotionState)
  }, [])

  const showVideo = motionState === 'normal'

  return (
    <div className={styles.heroMedia} aria-hidden="true">
      <Image
        src="/demo/immobilier/hero.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className={styles.heroImg}
      />
      {showVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/demo/immobilier/hero.jpg"
          preload="metadata"
          className={`${styles.heroVideo} ${videoReady ? styles.heroVideoReady : ''}`}
          onCanPlay={() => setVideoReady(true)}
          onError={() => {
            setVideoReady(false)
            setMotionState('error')
          }}
        >
          <source src="/demo/immobilier/hero-veo-20260724.mp4" type="video/mp4" />
        </video>
      )}
    </div>
  )
}
