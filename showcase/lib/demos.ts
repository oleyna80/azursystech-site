import type { DemoContent, DemoSite } from '@/lib/types'
import { content as assuranceContent, site as assuranceSite } from '@/demos/assurance/site'
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

// ── Bijoux artisanaux demo ────────────────────────────────────

const bijouxTheme: DemoSite['theme'] = {
  primary: '#2D2621',
  primaryFg: '#F9F7F2',
  accent: '#D9B4AB',
  bg: '#FDF8F7',
  surface: '#FFFFFF',
  border: '#F2E8D5',
  font: { heading: 'Libre Caslon Text', body: 'DM Sans' },
  radius: 'lg',
  sectionSpacing: 'spacious',
  buttonStyle: 'solid',
  cardStyle: 'elevated',
  imageStyle: 'rounded',
}

const bijouxSite: DemoSite = {
  slug: 'bijoux-artisanaux',
  title: 'Atelier Liora',
  category: 'Mini-catalogue / e-commerce light',
  description:
    'Un mini-catalogue élégant pour une créatrice de bijoux artisanaux, avec collections, fiches produit et demande sur mesure.',
  previewImage: {
    src: '/demo/bijoux-artisanaux/hero.jpg',
    alt: 'Bijoux artisanaux Atelier Liora',
    width: 1600,
    height: 1200,
  },
  niche: 'Bijoux artisanaux',
  nav: [
    { label: 'Accueil', href: '/demo/bijoux-artisanaux' },
    { label: 'Catalogue', href: '/demo/bijoux-artisanaux/catalogue' },
    { label: 'Sur mesure', href: '/demo/bijoux-artisanaux/custom-order' },
  ],
  pages: [
    {
      slug: '',
      label: 'Accueil',
      title: 'Atelier Liora',
      description: 'Bijoux artisanaux faits main, pièces uniques et petites séries.',
      sections: [
        { type: 'hero', contentKey: 'hero' },
        { type: 'services', contentKey: 'services' },
        { type: 'trust', contentKey: 'trust' },
        { type: 'finalCta', contentKey: 'final' },
      ],
    },
    {
      slug: 'catalogue',
      label: 'Catalogue',
      title: 'Catalogue Atelier Liora',
      description: 'Explorer les pièces de l’atelier.',
      sections: [
        { type: 'hero', contentKey: 'hero' },
        { type: 'services', contentKey: 'services' },
      ],
    },
    {
      slug: 'custom-order',
      label: 'Sur mesure',
      title: 'Création sur mesure',
      description: 'Préparer une demande de bijou personnalisé.',
      sections: [
        { type: 'hero', contentKey: 'hero' },
        { type: 'finalCta', contentKey: 'final' },
      ],
    },
  ],
  theme: bijouxTheme,
}

const bijouxContent: DemoContent = {
  hero: {
    eyebrow: 'Créations uniques',
    headline: 'Bijoux artisanaux faits main',
    subline:
      'Des pièces délicates façonnées avec passion dans notre studio. Une élégance intime pour célébrer vos instants précieux.',
    primaryCta: { label: 'Découvrir les collections', href: '/demo/bijoux-artisanaux/catalogue' },
    secondaryCta: { label: 'Créer un bijou sur mesure', href: '/demo/bijoux-artisanaux/custom-order' },
    image: {
      src: '/demo/bijoux-artisanaux/hero.jpg',
      alt: 'Bijoux artisanaux faits main',
      width: 1600,
      height: 1200,
    },
    trustBullets: ['Pièces uniques ou petites séries', 'Demande sur mesure', 'Réponse personnalisée'],
  },
  services: {
    title: 'Des créations à découvrir',
    intro: 'Bagues, colliers, bracelets et boucles d’oreilles en petites séries.',
    cta: { label: 'Voir le catalogue', href: '/demo/bijoux-artisanaux/catalogue' },
    items: [
      {
        icon: 'ring',
        title: 'Collections',
        description: 'Une sélection courte de pièces disponibles, sur commande ou en précommande.',
      },
      {
        icon: 'sparkle',
        title: 'Fiches produit',
        description: 'Matières, tailles, entretien et statut de disponibilité pour chaque bijou.',
      },
      {
        icon: 'atelier',
        title: 'Sur mesure',
        description: 'Une demande guidée pour préparer une création personnalisée avec l’atelier.',
      },
    ],
  },
  request: {
    title: 'Préparer une demande',
    body: 'Le formulaire aide à structurer une intention, un budget et un délai souhaité.',
    cta: { label: 'Créer sur mesure', href: '/demo/bijoux-artisanaux/custom-order' },
    fields: ['Nom', 'Email', 'Téléphone', 'Description', 'Budget', 'Délai souhaité'],
    note: 'Démo sans envoi réel de message.',
  },
  process: {
    title: 'Parcours client',
    steps: ['Explorer les collections', 'Choisir une pièce ou une intention', 'Envoyer une demande structurée'],
    humanControlNote: 'L’artisane confirme toujours le stock, le prix final, le délai et la faisabilité.',
  },
  area: {
    title: 'Atelier',
    body: 'Un univers éditorial pour présenter une créatrice, ses collections et son savoir-faire.',
    areas: ['Bijoux faits main', 'Petites séries', 'Création personnalisée'],
    badge: 'Atelier Liora',
  },
  trust: {
    title: 'Contrôle humain',
    points: [
      'Stock et prix final confirmés par l’atelier.',
      'Délais de production validés avant engagement.',
      'Chaque demande sur mesure reste une conversation humaine.',
    ],
  },
  automation: {
    title: 'Assistance de sélection',
    body: 'Le site peut guider une demande par style, budget, occasion et matériaux.',
    cta: { label: 'Préparer une demande', href: '/demo/bijoux-artisanaux/custom-order' },
    flow: ['Style', 'Budget', 'Matière', 'Délai', 'Résumé'],
    summary: [
      { label: 'Type', value: 'Mini-catalogue' },
      { label: 'Objectif', value: 'Demande qualifiée' },
    ],
  },
  faq: {
    title: 'Questions fréquentes',
    items: [
      {
        question: 'Le paiement est-il intégré ?',
        answer: 'Non. Cette démo privilégie la demande qualifiée avant paiement ou devis final.',
      },
      {
        question: 'Peut-on demander une pièce personnalisée ?',
        answer: 'Oui, le parcours sur mesure recueille les informations utiles pour l’artisane.',
      },
    ],
  },
  final: {
    title: 'Créer une présence élégante pour un atelier artisanal',
    body: 'Un mini-catalogue vivant peut transformer l’intérêt en demande claire sans construire une boutique complète dès la v1.',
    actions: [
      { label: 'Voir le catalogue', href: '/demo/bijoux-artisanaux/catalogue' },
      { label: 'Créer sur mesure', href: '/demo/bijoux-artisanaux/custom-order' },
    ],
  },
}

// ── Registry ──────────────────────────────────────────────────

const demos: Record<string, { site: DemoSite; content: DemoContent }> = {
  plomberie: { site: plomberieSite, content: plomberieContent },
  'salon-beaute': { site: salonBeautySite, content: salonBeautyContent },
  bistrot: placeholder('bistrot', 'Le Bistrot', 'Сайт с меню и бронью'),
  'bijoux-artisanaux': { site: bijouxSite, content: bijouxContent },
  assurance: { site: assuranceSite, content: assuranceContent },
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
