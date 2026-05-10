import type { Metadata } from "next";
import Link from "next/link";

import { LEGAL_CONTACT } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Suppression des données | AzurSysTech",
  description:
    "Instructions pour demander la suppression des données personnelles transmises à AzurSysTech via le site, le chat ou les canaux de contact.",
};

const SECTIONS = [
  {
    title: "1. Objet de cette page",
    paragraphs: [
      "Cette page explique comment demander la suppression des données personnelles que vous avez transmises à AzurSysTech via le site, le formulaire, le chat, l'email, le téléphone ou WhatsApp.",
      "Elle est fournie notamment pour répondre aux exigences de services tiers tels que Meta ou Facebook lorsqu'un lien public de suppression des données est demandé.",
    ],
  },
  {
    title: "2. Comment faire une demande",
    paragraphs: [
      "Pour demander la suppression de vos données, envoyez un message à AzurSysTech par email ou WhatsApp en indiquant clairement qu'il s'agit d'une demande de suppression des données.",
    ],
    items: [
      `Email : ${LEGAL_CONTACT.email}`,
      `WhatsApp : ${LEGAL_CONTACT.whatsappDisplay}`,
    ],
  },
  {
    title: "3. Informations à fournir",
    paragraphs: ["Pour traiter votre demande plus vite, merci de préciser si possible :"],
    items: [
      "votre nom ou le nom utilisé lors de la prise de contact",
      "l'adresse email ou le numéro de téléphone concerné",
      "la date approximative de votre demande ou de votre échange",
      "tout élément utile pour identifier les données à supprimer",
    ],
  },
  {
    title: "4. Vérification et traitement",
    paragraphs: [
      "AzurSysTech peut demander des informations complémentaires raisonnables pour vérifier que la demande provient bien de la personne concernée ou de son représentant autorisé.",
      "Si la demande est recevable, les données seront supprimées ou anonymisées dans la mesure permise par la loi et par les contraintes techniques applicables.",
    ],
  },
  {
    title: "5. Limites légales",
    paragraphs: [
      "Certaines données peuvent devoir être conservées lorsqu'une obligation légale, comptable, contractuelle ou de sécurité l'impose.",
      "Dans ce cas, les données concernées ne seront conservées que dans la limite nécessaire à cette obligation.",
    ],
  },
  {
    title: "6. Informations complémentaires",
    paragraphs: [
      "Pour en savoir plus sur la collecte et le traitement des données, vous pouvez consulter la politique de confidentialité et les mentions légales du site.",
    ],
  },
] as const;

export default function DataDeletionPage() {
  return (
    <main className="bg-[#F6F1E8] px-6 py-12 text-[#1F2A37]">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
        <header className="flex flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1F6F78]">AzurSysTech</p>
          <div className="flex flex-col gap-4 border-b border-[#D8D0C4] pb-8">
            <h1 className="font-serif text-3xl sm:text-4xl">Suppression des données</h1>
            <p className="text-base leading-7 text-[#1F2A37]/90">
              Si vous souhaitez demander la suppression de vos données personnelles, suivez les instructions ci-dessous.
            </p>
          </div>
        </header>

        {SECTIONS.map((section, index) => (
          <section
            key={section.title}
            className={`flex flex-col gap-4 ${index < SECTIONS.length - 1 ? "border-b border-[#D8D0C4] pb-8" : ""}`}
          >
            <h2 className="font-serif text-2xl">{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="leading-7 text-[#1F2A37]/90">
                {paragraph}
              </p>
            ))}
            {"items" in section && section.items ? (
              <ul className="grid gap-2 text-[#1F2A37]/90">
                {section.items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <section className="flex flex-wrap gap-4 pt-2 text-sm font-medium">
          <Link className="text-[#1F6F78] underline" href="/privacy">
            Politique de confidentialité
          </Link>
          <Link className="text-[#1F6F78] underline" href="/legal">
            Mentions légales
          </Link>
          <a className="text-[#1F6F78] underline" href={`mailto:${LEGAL_CONTACT.email}`}>
            {LEGAL_CONTACT.email}
          </a>
        </section>
      </div>
    </main>
  );
}
