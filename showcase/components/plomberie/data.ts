import type { PlumbingLandingContent, QuoteFormField } from "@/lib/types";

const quoteFields: QuoteFormField[] = [
  { label: "Nom complet", type: "text", required: true },
  { label: "Téléphone", type: "tel", required: true },
  { label: "E-mail", type: "email", required: true },
  {
    label: "Type de service",
    type: "select",
    placeholder: "Choisissez votre besoin",
    options: [
      "Dépannage urgent",
      "Réparation",
      "Installation",
      "Rénovation",
      "Chauffage",
      "Entretien",
    ],
    required: true,
  },
  {
    label: "Votre demande",
    type: "textarea",
    placeholder: "Décrivez le problème ou votre projet.",
    required: true,
  },
];

export const plomberieContent: PlumbingLandingContent = {
  hero: {
    badge: "Ligne d’urgence ouverte 24 h/24, 7 j/7",
    title: "Une urgence",
    highlightedLine: "d’eau à gérer ?",
    subtitle:
      "Un artisan plombier vous rappelle, pose les bonnes questions et organise l’intervention adaptée à Paris et en petite couronne.",
    primaryCta: { label: "Demander un devis", href: "#contact" },
    secondaryCta: {
      label: "Appeler le 01 23 45 67 89",
      href: "tel:+33123456789",
    },
    trustBullets: [
      "Diagnostic par téléphone",
      "Devis annoncé avant travaux",
      "Intervention soignée",
    ],
    image: {
      src: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=1800&q=86",
      alt: "Robinet moderne dans une salle de bain lumineuse",
      width: 1800,
      height: 1200,
    },
    form: {
      title: "Préparer votre",
      highlightedWord: "demande",
      fields: quoteFields,
      submitLabel: "Préparer ma demande",
    },
  },
  stats: [
    { value: "24/7", label: "Ligne d’urgence", icon: "clock" },
    { value: "Paris", label: "Et petite couronne", icon: "pin" },
    { value: "15 ans", label: "De métier", icon: "award" },
    { value: "Devis", label: "Clair avant travaux", icon: "check" },
  ],
  services: {
    title: "Une intervention",
    highlightedWord: "bien cadrée",
    subtitle:
      "Du dégât des eaux au projet de salle de bain, chaque demande suit un périmètre clair.",
    items: [
      {
        icon: "pipe",
        title: "Dépannage urgent",
        description:
          "Fuite, canalisation bouchée ou chauffe-eau à l’arrêt : nous qualifions le problème avant le déplacement.",
        cta: { label: "Signaler une urgence", href: "#request" },
      },
      {
        icon: "wrench",
        title: "Réparation",
        description:
          "Robinetterie, évacuation, mécanisme de WC et recherche de fuite.",
        cta: { label: "Demander un devis", href: "#contact" },
      },
      {
        icon: "gear",
        title: "Installation",
        description:
          "Sanitaires, chauffe-eau et équipements pensés pour durer.",
        cta: { label: "Demander un devis", href: "#contact" },
      },
      {
        icon: "home",
        title: "Rénovation",
        description:
          "Plomberie de cuisine ou salle de bain, coordonnée avec votre projet.",
        cta: { label: "Demander un devis", href: "#contact" },
      },
      {
        icon: "flame",
        title: "Chauffage",
        description:
          "Entretien et intervention sur les équipements d’eau chaude.",
        cta: { label: "Demander un devis", href: "#contact" },
      },
      {
        icon: "shield",
        title: "Entretien",
        description:
          "Prévenir les pannes récurrentes et prolonger vos installations.",
        cta: { label: "Demander un devis", href: "#contact" },
      },
    ],
  },
  why: {
    title: "Le bon geste",
    highlightedWord: "au bon moment",
    points: [
      "Un premier échange pour évaluer la situation",
      "Un créneau et un périmètre d’intervention confirmés",
      "Des explications simples avant toute décision",
      "Un chantier laissé propre après intervention",
    ],
    image: {
      src: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=84",
      alt: "Salle de bain rénovée avec vasque et douche",
      width: 1200,
      height: 1400,
    },
    badgeTitle: "Intervention documentée",
    badgeText: "Un devis et des explications avant travaux",
  },
  emergency: {
    label: "Urgence plomberie",
    title: "Une fuite importante ne doit pas attendre.",
    body: "Appelez-nous pour décrire la situation. Nous vous indiquons les premiers gestes utiles et organisons l’intervention selon l’urgence.",
    phone: "01 23 45 67 89",
    phoneHref: "tel:+33123456789",
    primaryCta: { label: "Préparer une demande", href: "#contact" },
    secondaryCta: { label: "Appeler maintenant", href: "tel:+33123456789" },
  },
  area: {
    title: "Un atelier mobile, proche de chez vous",
    body: "Nous intervenons à Paris et dans les communes limitrophes pour les urgences comme pour les projets planifiés.",
    zones: [
      "Paris intramuros",
      "Hauts-de-Seine",
      "Seine-Saint-Denis",
      "Val-de-Marne",
      "Yvelines Est",
      "Essonne Nord",
    ],
    mapLabel: "Secteurs d’intervention autour de Paris",
  },
  reviews: {
    title: "Des retours",
    highlightedWord: "après intervention",
    subtitle:
      "Un aperçu de démonstration de témoignages qui pourraient être synchronisés depuis Google Maps.",
    cta: { label: "Préparer ma demande", href: "#contact" },
    items: [
      {
        name: "Marie D.",
        location: "Paris 15e",
        text: "La fuite sous l’évier a été comprise au téléphone et traitée comme annoncé. Tout était propre après le passage.",
        date: "Aperçu de démonstration Google Maps",
      },
      {
        name: "Alexandre R.",
        location: "Montreuil",
        text: "Le chauffe-eau a été remplacé dans le créneau prévu, avec des explications simples avant l’intervention.",
        date: "Aperçu de démonstration Google Maps",
      },
      {
        name: "Sonia L.",
        location: "Saint-Ouen-sur-Seine",
        text: "Pour le mécanisme de chasse d’eau, le diagnostic et la réparation ont été clairs et rapides.",
        date: "Aperçu de démonstration Google Maps",
      },
      {
        name: "Camille B.",
        location: "Ivry-sur-Seine",
        text: "La canalisation de cuisine a été débouchée sans surprise, avec les gestes à retenir pour éviter que le problème revienne.",
        date: "Aperçu de démonstration Google Maps",
      },
      {
        name: "Nicolas F.",
        location: "Boulogne-Billancourt",
        text: "L’installation du lave-mains a été bien préparée et les finitions sont restées soignées.",
        date: "Aperçu de démonstration Google Maps",
      },
    ],
  },
  contact: {
    title: "Parlons de votre besoin",
    body: "Cette demande reste dans la démo. Aucun message n’est envoyé : elle vous permet simplement de parcourir le parcours de contact.",
    info: [
      {
        icon: "phone",
        label: "Téléphone",
        value: "01 23 45 67 89",
        href: "tel:+33123456789",
      },
      {
        icon: "mail",
        label: "E-mail",
        value: "contact@plomberie-pro.fr",
        href: "mailto:contact@plomberie-pro.fr",
      },
      { icon: "pin", label: "Secteur", value: "Paris et petite couronne" },
      { icon: "clock", label: "Urgences", value: "24 h/24, 7 j/7" },
    ],
    form: {
      title: "Votre",
      highlightedWord: "demande",
      fields: quoteFields,
      submitLabel: "Valider dans la démo",
    },
  },
};
