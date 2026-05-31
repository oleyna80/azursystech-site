import type { DemoContent, DemoSite, DemoSlot } from './types'

const registry: Record<
  string,
  () => Promise<{ site: DemoSite; content: DemoContent }>
> = {
  plomberie: () => import('../demos/plomberie/site'),
}

export const demoSlots: DemoSlot[] = [
  {
    slug: 'plomberie',
    title: 'Plomberie Pro',
    category: 'Локальная выездная услуга',
    pattern: 'urgent-service',
    description: 'Срочная заявка, звонок, WhatsApp и структурирование обращения мастеру.',
    href: '/demo/plomberie',
    status: 'active',
    gradient: 'from-[#1A3C5E] via-[#1A3C5E]/90 to-[#E0553F]/20',
    abbr: 'PL',
  },
  {
    slug: 'salon-beaute',
    title: 'Salon Beauté',
    category: 'Запись и услуги',
    pattern: 'appointment-brand',
    description: 'Услуги, мастера, атмосфера и быстрая запись.',
    status: 'planned',
    gradient: 'from-[#8B6B5E] via-[#8B6B5E]/90 to-[#D4A574]/20',
    abbr: 'SB',
  },
  {
    slug: 'bistrot',
    title: 'Le Bistrot',
    category: 'Кафе и ресторан',
    pattern: 'hospitality-menu',
    description: 'Меню, фото блюд, бронь и локальная атмосфера.',
    status: 'planned',
    gradient: 'from-[#4A3222] via-[#4A3222]/90 to-[#C67C3C]/20',
    abbr: 'LB',
  },
  {
    slug: 'bijoux-artisanaux',
    title: 'Bijoux Artisanaux',
    category: 'Каталог и история',
    pattern: 'catalog-editorial',
    description: 'Изделия, мастерская, заявка и editorial-подача.',
    status: 'planned',
    gradient: 'from-[#1A1A1A] via-[#1A1A1A]/90 to-[#C9A96E]/20',
    abbr: 'BA',
  },
  {
    slug: 'assurance',
    title: "Agent d'Assurance",
    category: 'Профессиональная услуга',
    pattern: 'professional-trust',
    description: 'Консультация, продукты, документы и доверие.',
    status: 'planned',
    gradient: 'from-[#1F3D4F] via-[#1F3D4F]/90 to-[#2E7D6F]/20',
    abbr: 'AA',
  },
  {
    slug: 'comptabilite',
    title: 'Cabinet Comptable',
    category: 'B2B-заявка',
    pattern: 'professional-office',
    description: 'Услуги, аудитория, спокойная структура и форма для бизнеса.',
    status: 'planned',
    gradient: 'from-[#2D3748] via-[#2D3748]/90 to-[#5A7D6B]/20',
    abbr: 'CC',
  },
]

export function getDemoSlugs(): string[] {
  return Object.keys(registry)
}

export async function getDemoConfig(slug: string): Promise<DemoSite | null> {
  const loader = registry[slug]
  if (!loader) return null
  const demo = await loader()
  return demo.site
}

export async function getDemoContent(slug: string): Promise<DemoContent | null> {
  const loader = registry[slug]
  if (!loader) return null
  const demo = await loader()
  return demo.content
}

export async function getDemo(slug: string): Promise<{
  site: DemoSite
  content: DemoContent
} | null> {
  const loader = registry[slug]
  if (!loader) return null
  return loader()
}

export async function getAllDemos(): Promise<DemoSite[]> {
  const demos = await Promise.all(Object.values(registry).map((loader) => loader()))
  return demos.map((demo) => demo.site)
}

export async function getAllDemoPages(): Promise<Array<{ slug: string; page: string }>> {
  const demos = await getAllDemos()
  return demos.flatMap((demo) =>
    demo.pages
      .filter((page) => page.slug !== '')
      .map((page) => ({ slug: demo.slug, page: page.slug })),
  )
}
