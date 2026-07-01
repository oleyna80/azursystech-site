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
  tag: string
  label: string
  desc: string
  subtitle: string
  intro: string[]
  guarantees: string[]
}

export const PRODUCTS: Product[] = [
  {
    slug: 'auto',
    icon: CarIcon,
    tag: 'Automobile',
    label: 'Assurance Auto',
    desc: 'RC, tous risques, conducteur novice',
    subtitle:
      'RC obligatoire, tous risques et garanties optionnelles. Je vous trouve la meilleure offre parmi AXA et Allianz.',
    intro: [
      "L'assurance automobile est obligatoire en France. Mais au-delà de la responsabilité civile minimale, vous avez le choix entre plusieurs niveaux de couverture selon votre véhicule et votre usage.",
      "Que vous soyez jeune conducteur, propriétaire d'un véhicule de collection, conducteur malussé ou simplement à la recherche d'un meilleur tarif, je compare les offres d'AXA et d'Allianz pour vous proposer le contrat le plus adapté.",
    ],
    guarantees: [
      'Responsabilité civile obligatoire (RC)',
      'Dommages tous accidents (tous risques)',
      'Vol et tentative de vol',
      'Incendie et explosion',
      'Bris de glace',
      'Catastrophes naturelles et technologiques',
      'Assistance 0 km',
      'Garantie conducteur',
    ],
  },
  {
    slug: 'habitation',
    icon: HomeIcon,
    tag: 'Habitation',
    label: 'Habitation (MRH)',
    desc: 'Propriétaires, locataires, copropriété',
    subtitle:
      'Multirisque habitation pour propriétaires, locataires et copropriétaires. Couverture complète de votre logement.',
    intro: [
      "La multirisque habitation (MRH) protège votre logement et tout ce qu'il contient contre les risques du quotidien : dégât des eaux, incendie, vol, catastrophes naturelles... Elle couvre également votre responsabilité civile en tant qu'occupant.",
      'Que vous soyez locataire (MRH obligatoire) ou propriétaire, je sélectionne pour vous le contrat qui correspond à la superficie de votre logement, sa localisation et vos besoins spécifiques (cave, parking, jardin, objets de valeur).',
    ],
    guarantees: [
      'Incendie, explosion, foudre',
      "Dégât des eaux et fuite",
      'Vol et cambriolage',
      'Bris de glace',
      'Catastrophes naturelles',
      'Responsabilité civile vie privée',
      'Protection juridique habitation',
      'Objets de valeur (en option)',
    ],
  },
  {
    slug: 'sante',
    icon: HeartIcon,
    tag: 'Santé',
    label: 'Santé / Mutuelle',
    desc: 'Complémentaire santé individuelle et famille',
    subtitle:
      'Complémentaire santé individuelle et familiale. Des remboursements optimisés pour vos dépenses de santé.',
    intro: [
      "La Sécurité sociale ne rembourse qu'une partie de vos dépenses de santé. Une complémentaire santé prend en charge tout ou partie du reste à votre charge (ticket modérateur, franchise, dépassements d'honoraires).",
      'Je vous aide à choisir une mutuelle adaptée à votre profil - jeune actif, famille, senior, TNS - en équilibrant niveau de garanties et montant de la cotisation. Je vérifie également votre éligibilité à la complémentaire santé solidaire (CSS).',
    ],
    guarantees: [
      'Médecins généralistes et spécialistes',
      'Hospitalisation et chirurgie',
      'Optique : lunettes et lentilles',
      'Dentaire : soins et prothèses',
      'Maternité et naissance',
      'Médecines douces (ostéopathie, etc.)',
      'Audioprothèses',
      'Remboursements 100% santé (RAC 0)',
    ],
  },
  {
    slug: 'responsabilite-civile',
    icon: ShieldIcon,
    tag: 'Responsabilité',
    label: 'Responsabilité Civile',
    desc: 'RC pro, RC vie privée, TNS',
    subtitle:
      'RC professionnelle pour indépendants et TNS, RC vie privée pour particuliers. Protection contre les dommages causés à autrui.',
    intro: [
      "La responsabilité civile couvre les dommages que vous, votre famille ou vos salariés causez involontairement à des tiers. Elle est souvent incluse dans la MRH, mais une couverture spécifique peut être nécessaire pour les activités professionnelles.",
      "Pour les travailleurs indépendants, professions libérales, artisans et commerçants, la RC professionnelle est indispensable - parfois obligatoire selon votre secteur d'activité. Je vous aide à identifier vos obligations légales et à trouver le contrat adapté.",
    ],
    guarantees: [
      'Dommages corporels causés à autrui',
      'Dommages matériels causés à autrui',
      'Dommages immatériels consécutifs',
      'RC professionnelle (TNS, libéraux, artisans)',
      'RC vie privée et familiale',
      'Défense pénale et recours',
      'Protection juridique professionnelle',
    ],
  },
  {
    slug: 'emprunteur',
    icon: DollarIcon,
    tag: 'Crédit Immobilier',
    label: 'Assurance Emprunteur',
    desc: 'Pour crédit immobilier (loi Lemoine)',
    subtitle:
      "Pour votre crédit immobilier. Loi Lemoine : changez d'assurance à tout moment et économisez jusqu'à 15 000 €.",
    intro: [
      "L'assurance emprunteur est exigée par votre banque pour obtenir un crédit immobilier. Elle vous protège (et protège votre famille) en cas de décès, d'invalidité ou d'incapacité de travail, en prenant en charge le remboursement de votre prêt.",
      "Depuis la loi Lemoine (2022), vous pouvez changer d'assurance emprunteur à tout moment, même en cours de prêt. C'est souvent une source d'économies significatives : jusqu'à 15 000 € sur la durée d'un prêt de 200 000 €. Contactez-moi pour une simulation gratuite.",
    ],
    guarantees: [
      'Décès toutes causes',
      "Perte totale et irréversible d'autonomie (PTIA)",
      'Invalidité permanente totale (IPT)',
      'Invalidité permanente partielle (IPP)',
      'Incapacité temporaire de travail (ITT)',
      "Perte d'emploi (en option)",
      'Couverture sans sélection médicale (loi Lemoine)',
    ],
  },
  {
    slug: 'prevoyance',
    icon: UmbrellaIcon,
    tag: 'Prévoyance',
    label: 'Prévoyance & Vie',
    desc: 'Décès, invalidité, épargne long terme',
    subtitle:
      'Protégez vos proches et constituez votre épargne. Contrats de prévoyance individuelle et assurance vie.',
    intro: [
      "La prévoyance vous permet de protéger vos proches en cas de coup dur (décès, invalidité, longue maladie) en leur assurant un capital ou une rente pour maintenir leur niveau de vie. C'est une protection essentielle, souvent sous-estimée.",
      "L'assurance vie est quant à elle un outil d'épargne et de transmission patrimoniale très flexible, avec des avantages fiscaux spécifiques. Je vous guide dans la constitution d'un contrat adapté à vos objectifs : épargne, retraite, transmission.",
    ],
    guarantees: [
      'Capital décès versé aux bénéficiaires',
      'Rente éducation pour vos enfants',
      'Invalidité : maintien de revenus',
      'Arrêt de travail longue durée',
      'Épargne à long terme (assurance vie)',
      'Avantages fiscaux succession',
      'Rachats partiels possibles',
    ],
  },
  {
    slug: 'scolaire',
    icon: BookIcon,
    tag: 'Famille',
    label: 'Assurance Scolaire',
    desc: 'Enfants et activités périscolaires',
    subtitle:
      "Protégez vos enfants à l'école et lors des activités extrascolaires. Couverture individuelle accident et RC.",
    intro: [
      "L'assurance scolaire n'est pas légalement obligatoire pour les activités scolaires classiques, mais elle est fortement recommandée et souvent exigée pour les sorties, voyages et activités sportives. Elle couvre votre enfant qu'il soit victime ou responsable d'un accident.",
      "Les tarifs de l'assurance scolaire sont très accessibles - quelques dizaines d'euros par an - pour une protection complète couvrant l'année scolaire entière. Je vous propose des contrats incluant les activités extra-scolaires et les voyages à l'étranger.",
    ],
    guarantees: [
      'Accidents scolaires (victime ou responsable)',
      'Activités périscolaires et sorties',
      'Sports et loisirs',
      "Responsabilité civile de l'enfant",
      'Frais médicaux et hospitalisation',
      'Défense recours accidents',
      "Valable en France et à l'étranger (voyages scolaires)",
    ],
  },
  {
    slug: 'entreprise',
    icon: BriefcaseIcon,
    tag: 'Professionnels',
    label: 'Assurance Entreprise',
    desc: 'Protection de votre activité, locaux et salariés',
    subtitle:
      'Multirisque professionnelle, RC Pro, protection de vos locaux, de votre activité et de vos salariés.',
    intro: [
      "Diriger une entreprise comporte des risques au quotidien. Qu'il s'agisse de couvrir vos locaux contre un incendie, de protéger votre responsabilité civile face à un client ou de mettre en place la mutuelle obligatoire pour vos salariés, chaque détail compte.",
      "En tant qu'agent d'assurance indépendant, je réalise un audit précis des risques liés à votre secteur d'activité (commerce, artisanat, profession libérale, PME) et je négocie les meilleures garanties auprès d'AXA et Allianz.",
    ],
    guarantees: [
      'Responsabilité Civile Professionnelle (RC Pro)',
      'Assurance Multirisque Professionnelle',
      "Pertes d'exploitation en cas de sinistre",
      'Protection Juridique professionnelle',
      "Mutuelle d'entreprise (collective santé)",
      'Prévoyance collective des salariés',
      'Assurance décennale (métiers du bâtiment)',
      'Protection des locaux, équipements et stocks',
    ],
  },
]

export function productHref(slug: string) {
  return `/demo/assurance/assurances/${slug}`
}

export function getProduct(slug: string) {
  return PRODUCTS.find((product) => product.slug === slug)
}
