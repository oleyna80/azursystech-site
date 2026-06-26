import {
  BookIcon,
  BriefcaseIcon,
  CarIcon,
  DollarIcon,
  HeartIcon,
  HomeIcon,
  ShieldIcon,
  UmbrellaIcon,
} from './Icons'
import type { ComponentType } from 'react'

export type Product = {
  slug: string
  icon: ComponentType<{ className?: string }>
  label: string
  desc: string
}

export const PRODUCTS: Product[] = [
  { slug: 'auto', icon: CarIcon, label: 'Assurance Auto', desc: 'RC, tous risques, conducteur novice' },
  { slug: 'habitation', icon: HomeIcon, label: 'Habitation (MRH)', desc: 'Propriétaires, locataires, copropriété' },
  { slug: 'sante', icon: HeartIcon, label: 'Santé / Mutuelle', desc: 'Complémentaire santé individuelle et famille' },
  { slug: 'responsabilite-civile', icon: ShieldIcon, label: 'Responsabilité Civile', desc: 'RC pro, RC vie privée, TNS' },
  { slug: 'emprunteur', icon: DollarIcon, label: 'Assurance Emprunteur', desc: 'Pour crédit immobilier (loi Lemoine)' },
  { slug: 'prevoyance', icon: UmbrellaIcon, label: 'Prévoyance & Vie', desc: 'Décès, invalidité, épargne long terme' },
  { slug: 'scolaire', icon: BookIcon, label: 'Assurance Scolaire', desc: 'Enfants et activités périscolaires' },
  { slug: 'entreprise', icon: BriefcaseIcon, label: 'Assurance Entreprise', desc: 'Protection de votre activité, locaux et salariés' },
]

export function productHref(slug: string) {
  return `/demo/assurance/assurances/${slug}`
}
