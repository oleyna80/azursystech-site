import Image from 'next/image'
import type { DemoSite, HeroContent } from '@/lib/types'

type Props = {
  site: DemoSite
  content: HeroContent
}

export function HeroSection({ content, site }: Props) {
  return (
    <section className="demo-hero" id="top">
      {content.image.src ? (
        <Image
          alt={content.image.alt}
          className="demo-hero__image"
          height={content.image.height}
          priority
          src={content.image.src}
          width={content.image.width}
        />
      ) : null}
      <div className="demo-hero__overlay" />
      <div className="demo-hero__content">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>{content.headline}</h1>
        <p>{content.subline}</p>
        <div className="button-row">
          <a className="button button--primary" href={content.primaryCta.href}>
            {content.primaryCta.label}
          </a>
          <a className="button button--secondary" href={content.secondaryCta.href}>
            {content.secondaryCta.label}
          </a>
        </div>
        <ul className="hero-trust" aria-label={`${site.title} trust points`}>
          {content.trustBullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
