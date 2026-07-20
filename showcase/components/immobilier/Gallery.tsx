'use client'

import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
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
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const openerRef = useRef<HTMLButtonElement | null>(null)
  const dialogId = `rv-gallery-${title.replace(/\s+/g, '-').toLowerCase().slice(0, 20)}`
  const headingId = `${dialogId}-heading`
  const counterId = `${dialogId}-counter`

  const prev = useCallback(() => {
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  }, [images.length])

  const next = useCallback(() => {
    setIndex((i) => (i === images.length - 1 ? 0 : i + 1))
  }, [images.length])

  const openAt = (i: number, opener: HTMLButtonElement) => {
    openerRef.current = opener
    setIndex(i)
    setOpen(true)
  }

  const close = useCallback(() => {
    setOpen(false)
  }, [])

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    return () => {
      requestAnimationFrame(() => openerRef.current?.focus())
    }
  }, [open])

  const handleDialogKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      close()
      return
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      prev()
      return
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      next()
      return
    }

    if (event.key !== 'Tab') return

    const controls = Array.from(
      dialogRef.current?.querySelectorAll<HTMLButtonElement>('button:not([disabled])') ?? [],
    ).filter((control) => control.getClientRects().length > 0)
    if (controls.length === 0) return

    const first = controls[0]
    const last = controls[controls.length - 1]
    const active = document.activeElement
    if (event.shiftKey && (active === first || !dialogRef.current?.contains(active))) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && (active === last || !dialogRef.current?.contains(active))) {
      event.preventDefault()
      first.focus()
    }
  }

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
          className={`${styles.thumb} ${styles.thumbPrimary}`}
          onClick={(event) => openAt(0, event.currentTarget)}
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
                onClick={(event) => openAt(i + 1, event.currentTarget)}
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
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={headingId}
          aria-describedby={counterId}
          onKeyDown={handleDialogKeyDown}
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
            <div className={styles.lbDots} role="group" aria-label={t.gallery_photos}>
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`${styles.lbDot} ${i === index ? styles.lbDotActive : ''}`}
                  onClick={() => setIndex(i)}
                  aria-label={`${t.gallery_photo} ${i + 1}`}
                  aria-pressed={i === index}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
