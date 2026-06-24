import type { DemoContent, DemoSite } from '@/lib/types'
import { content as plomberieContent, site as plomberieSite } from '@/demos/plomberie/site'
import { content as salonBeautyContent, site as salonBeautySite } from '@/demos/salon-beaute/site'

// ── Placeholder generator for not-yet-implemented demos ───────

const placeholderTheme: DemoSite['theme'] = {
  primary: '#1a1a2e',
  primaryFg: '#F7FAFC',
  accent: '#0D9488',
  bg: '#F8F9FA',
  surface: '#FFFFFF',
  border: '#DEE2E6',
  font: { heading: 'Arial', body: 'Arial' },
  radius: 'md',
  sectionSpacing: 'normal',
  buttonStyle: 'solid',
  cardStyle: 'bordered',
  imageStyle: 'natural',
}

function placeholder(slug: string, title: string, category: string): { site: DemoSite; content: DemoContent } {
  const site: DemoSite = {
    slug,
    title,
    category,
    description: `${title} — скоро будет доступен.`,
    previewImage: { src: '', alt: '', width: 1200, height: 800 },
    niche: category,
    nav: [{ label: 'Главная', href: '#' }],
    pages: [
      {
        slug: '',
        label: 'Главная',
        title: `${title} (скоро)`,
        description: `${title} — демо-шаблон в разработке.`,
        sections: [
          { type: 'hero', contentKey: 'hero' },
          { type: 'finalCta', contentKey: 'final' },
        ],
      },
    ],
    theme: placeholderTheme,
  }

  const content: DemoContent = {
    hero: {
      eyebrow: `${category} · скоро`,
      headline: title,
      subline: 'Этот демо-шаблон находится в разработке и скоро будет доступен для просмотра.',
      primaryCta: { label: 'Вернуться к списку', href: '/' },
      secondaryCta: { label: 'Обсудить проект', href: '#contact' },
      image: { src: '', alt: '', width: 1800, height: 1200 },
      trustBullets: ['Демо-шаблон готовится', 'Скоро здесь будет пример сайта'],
    },
    services: { title: '', intro: '', cta: { label: '', href: '' }, items: [] },
    request: { title: '', body: '', cta: { label: '', href: '' }, fields: [], note: '' },
    process: { title: '', steps: [], humanControlNote: '' },
    area: { title: '', body: '', areas: [], badge: '' },
    trust: { title: '', points: [] },
    automation: { title: '', body: '', cta: { label: '', href: '' }, flow: [], summary: [] },
    faq: { title: '', items: [] },
    final: {
      title: 'Хотите сайт для вашего бизнеса?',
      body: 'Этот шаблон в разработке, но мы можем обсудить ваш проект уже сейчас.',
      actions: [
        { label: 'Вернуться к списку', href: '/' },
        { label: 'Обсудить проект', href: '#contact' },
      ],
    },
  }

  return { site, content }
}

// ── Registry ──────────────────────────────────────────────────

const demos: Record<string, { site: DemoSite; content: DemoContent }> = {
  plomberie: { site: plomberieSite, content: plomberieContent },
  'salon-beaute': { site: salonBeautySite, content: salonBeautyContent },
  bistrot: placeholder('bistrot', 'Le Bistrot', 'Сайт с меню и бронью'),
  'bijoux-artisanaux': placeholder('bijoux-artisanaux', 'Bijoux Artisanaux', 'Мини-каталог / e-commerce light'),
  assurance: placeholder('assurance', "Agent d'Assurance", 'B2B-сайт для сбора лидов'),
  comptabilite: placeholder('comptabilite', 'Cabinet Comptable', 'Сайт кабинета с intake-формой'),
}

// ── Public API (consumed by app/demo/[slug]/…) ────────────────

export function getDemoSlugs(): string[] {
  return Object.keys(demos)
}

export function getDemoConfig(slug: string): DemoSite | null {
  return demos[slug]?.site ?? null
}

export function getDemo(slug: string): { site: DemoSite; content: DemoContent } | null {
  return demos[slug] ?? null
}

export function getAllDemoPages(): Array<{ slug: string; page: string }> {
  return Object.entries(demos).flatMap(([slug, demo]) =>
    demo.site.pages
      .filter((p) => p.slug !== '')
      .map((p) => ({ slug, page: p.slug })),
  )
}
