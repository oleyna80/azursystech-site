'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { UI } from './types'
import styles from './gallery.module.css'

type GalleryProps = {
  images: string[]
  title: string
  t: UI['detail']
}

export function Gallery({ images, title, t }: GalleryProps) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const closeRef = useRef<HTMLButtonElement>(null)
  const openBtnRef = useRef<HTMLButtonElement>(null)
  const dialogId = `rv-gallery-${title.replace(/\s+/g, '-').toLowerCase().slice(0, 20)}`
  const headingId = `${dialogId}-heading`
  const counterId = `${dialogId}-counter`

  const prev = useCallback(() => {
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  }, [images.length])

  const next = useCallback(() => {
    setIndex((i) => (i === images.length - 1 ? 0 : i + 1))
  }, [images.length])

  const openAt = (i: number) => {
    setIndex(i)
    setOpen(true)
  }

  const close = () => {
    setOpen(false)
    // Return focus to the thumbnail that opened the lightbox
    requestAnimationFrame(() => openBtnRef.current?.focus())
  }

  // Keyboard handling
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    // Move focus inside dialog
    closeRef.current?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [open, prev, next])

  // Prevent body scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (images.length === 0) return null

  const [primary, ...rest] = images

  return (
    <div className={styles.gallery}>
      {/* Thumbnail grid */}
      <div className={styles.grid}>
        {/* Primary large image */}
        <button
          type="button"
          ref={openBtnRef}
          className={`${styles.thumb} ${styles.thumbPrimary}`}
          onClick={() => openAt(0)}
          aria-label={`${t.gallery_open} — ${title} 1 ${t.image_of} ${images.length}`}
        >
          <div className={styles.thumbInner}>
            <Image
              src={primary}
              alt={`${title} — photo 1`}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className={styles.thumbImg}
              priority
            />
          </div>
          <span className={styles.thumbHint} aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M1 1h5M1 1v5M15 1h-5M15 1v5M1 15h5M1 15v-5M15 15h-5M15 15v-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {images.length}
          </span>
        </button>

        {/* Secondary thumbnails */}
        {rest.length > 0 && (
          <div className={styles.thumbSecondary}>
            {rest.map((src, i) => (
              <button
                key={src}
                type="button"
                className={styles.thumb}
                onClick={() => openAt(i + 1)}
                aria-label={`${t.gallery_open} — ${title} ${i + 2} ${t.image_of} ${images.length}`}
              >
                <div className={styles.thumbInner}>
                  <Image
                    src={src}
                    alt={`${title} — photo ${i + 2}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className={styles.thumbImg}
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {open && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-labelledby={headingId}
          aria-describedby={counterId}
          onClick={(e) => { if (e.target === e.currentTarget) close() }}
        >
          {/* SR-only heading */}
          <h2 id={headingId} className={styles.lbTitle}>{title}</h2>
          {/* Close */}
          <button
            ref={closeRef}
            type="button"
            className={styles.lbClose}
            onClick={close}
            aria-label={t.gallery_close}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Counter */}
          <p id={counterId} className={styles.lbCounter} aria-live="polite">
            {index + 1} {t.image_of} {images.length}
          </p>

          {/* Image */}
          <div className={styles.lbStage}>
            <div className={styles.lbImageWrap}>
              <Image
                src={images[index]}
                alt={`${title} — photo ${index + 1}`}
                fill
                sizes="100vw"
                className={styles.lbImg}
                priority
              />
            </div>
          </div>

          {/* Prev / Next */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                className={`${styles.lbNav} ${styles.lbNavPrev}`}
                onClick={prev}
                aria-label={t.gallery_prev}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M13 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                type="button"
                className={`${styles.lbNav} ${styles.lbNavNext}`}
                onClick={next}
                aria-label={t.gallery_next}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </>
          )}

          {/* Dots */}
          {images.length > 1 && (
            <div className={styles.lbDots} role="tablist" aria-label={`${images.length} photos`}>
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  className={`${styles.lbDot} ${i === index ? styles.lbDotActive : ''}`}
                  onClick={() => setIndex(i)}
                  aria-label={`Photo ${i + 1}`}
                  aria-selected={i === index}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
