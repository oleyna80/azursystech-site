"use client";

import Image from "next/image";
import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import type { PlumbingReview, QuoteFormField, StatItem } from "@/lib/types";
import { plomberieContent } from "./data";
import { PlomberieFooter } from "./Footer";
import { PlomberieNav } from "./Nav";
import styles from "./home.module.css";
import iconStyles from "./icons.module.css";

export function PlomberieHomePage() {
  const content = plomberieContent;
  const featuredService = content.services.items[0];

  return (
    <>
      <PlomberieNav />
      <main className={styles.page} id="top">
        <section className={styles.hero} aria-labelledby="pl-hero-title">
          <div className={styles.container}>
            <div className={styles.heroStage}>
              <div className={styles.heroCopy}>
                <p className={styles.eyebrow}>
                  <span />
                  {content.hero.badge}
                </p>
                <h1 id="pl-hero-title">
                  {content.hero.title}
                  <span>{content.hero.highlightedLine}</span>
                </h1>
                <p className={styles.heroLead}>{content.hero.subtitle}</p>
                <div
                  className={styles.actions}
                  aria-label="Actions principales"
                >
                  <a
                    className={`${styles.button} ${styles.buttonPrimary}`}
                    href={content.hero.primaryCta.href}
                  >
                    {content.hero.primaryCta.label}
                    <Icon name="arrow" />
                  </a>
                  <a
                    className={`${styles.button} ${styles.buttonSecondary}`}
                    href={content.hero.secondaryCta.href}
                  >
                    <Icon name="phone" />
                    {content.hero.secondaryCta.label}
                  </a>
                </div>
                <ul className={styles.trustList} aria-label="Garanties">
                  {content.hero.trustBullets.map((item) => (
                    <li key={item}>
                      <Icon name="check" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.heroVisual}>
                <Image
                  alt={content.hero.image.alt}
                  className={styles.heroImage}
                  height={content.hero.image.height}
                  priority
                  src={content.hero.image.src}
                  width={content.hero.image.width}
                />
                <div className={styles.heroNote}>
                  <span>Disponibilité</span>
                  <strong>
                    24 h/24
                    <br />7 j/7
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.proofRail} aria-label="Repères de service">
          <div className={styles.container}>
            <div className={styles.stats}>
              {content.stats.map((item) => (
                <StatCard item={item} key={item.label} />
              ))}
            </div>
          </div>
        </section>

        <section
          className={styles.section}
          id="services"
          aria-labelledby="pl-services-title"
        >
          <div className={styles.container}>
            <SectionHeader
              title={content.services.title}
              highlightedWord={content.services.highlightedWord}
              subtitle={content.services.subtitle}
              titleId="pl-services-title"
            />
            <div className={styles.serviceLayout}>
              <article className={styles.featuredService}>
                <div className={styles.serviceIndex}>
                  01 <span>Priorité</span>
                </div>
                <Icon name={featuredService.icon} />
                <h3>{featuredService.title}</h3>
                <p>{featuredService.description}</p>
                <a
                  className={`${styles.button} ${styles.featuredServiceButton}`}
                  href={featuredService.cta.href}
                >
                  {featuredService.cta.label}
                  <Icon name="arrow" />
                </a>
              </article>
              <ol className={styles.serviceList}>
                {content.services.items.slice(1).map((item, index) => (
                  <li key={item.title}>
                    <span>0{index + 2}</span>
                    <div>
                      <Icon name={item.icon} />
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section
          className={`${styles.section} ${styles.evidence}`}
          id="about"
          aria-labelledby="pl-why-title"
        >
          <div className={styles.container}>
            <div className={styles.evidenceGrid}>
              <div className={styles.evidenceImage}>
                <Image
                  alt={content.why.image.alt}
                  height={content.why.image.height}
                  src={content.why.image.src}
                  width={content.why.image.width}
                />
                <div className={styles.imageStamp}>
                  <strong>{content.why.badgeTitle}</strong>
                  <span>{content.why.badgeText}</span>
                </div>
              </div>
              <div className={styles.why}>
                <p className={styles.eyebrow}>
                  <span />
                  Notre méthode
                </p>
                <h2 id="pl-why-title">
                  {content.why.title}
                  <span>{content.why.highlightedWord}</span>
                </h2>
                <ul>
                  {content.why.points.map((point) => (
                    <li key={point}>
                      <Icon name="check" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section
          className={styles.emergency}
          id="request"
          aria-labelledby="pl-emergency-title"
        >
          <div className={styles.container}>
            <div className={styles.emergencyInner}>
              <div>
                <p className={styles.urgentLabel}>
                  <span />
                  {content.emergency.label}
                </p>
                <h2 id="pl-emergency-title">{content.emergency.title}</h2>
                <p>{content.emergency.body}</p>
              </div>
              <div className={styles.emergencyActions}>
                <a
                  className={styles.phoneCard}
                  href={content.emergency.phoneHref}
                >
                  <Icon name="phone" />
                  <span>
                    Appel direct<strong>{content.emergency.phone}</strong>
                  </span>
                </a>
                <a
                  className={`${styles.button} ${styles.buttonCoral}`}
                  href={content.emergency.primaryCta.href}
                >
                  {content.emergency.primaryCta.label}
                  <Icon name="arrow" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          className={`${styles.section} ${styles.coverage}`}
          id="zone"
          aria-labelledby="pl-area-title"
        >
          <div className={styles.container}>
            <div className={styles.coverageGrid}>
              <div>
                <p className={styles.eyebrow}>
                  <span />
                  Secteurs d’intervention
                </p>
                <h2 id="pl-area-title">{content.area.title}</h2>
                <p className={styles.coverageLead}>{content.area.body}</p>
                <div
                  className={styles.map}
                  role="img"
                  aria-label={content.area.mapLabel}
                >
                  <span className={styles.mapCircle} />
                  <span className={styles.mapParis}>
                    <Icon name="pin" />
                    Paris
                  </span>
                  <span className={styles.mapNorth}>Saint-Denis</span>
                  <span className={styles.mapWest}>Nanterre</span>
                  <span className={styles.mapSouth}>Créteil</span>
                </div>
              </div>
              <div className={styles.zoneList}>
                {content.area.zones.map((zone, index) => (
                  <div key={zone}>
                    <span>0{index + 1}</span>
                    {zone}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className={`${styles.section} ${styles.reviewSection}`}
          id="avis"
          aria-labelledby="pl-reviews-title"
        >
          <div className={styles.container}>
            <div className={styles.reviewHeader}>
              <p className={styles.eyebrow}>
                <span />
                Retours clients
              </p>
              <h2 id="pl-reviews-title">
                {content.reviews.title}
                <span>{content.reviews.highlightedWord}</span>
              </h2>
              <p>{content.reviews.subtitle}</p>
              <a className={styles.textLink} href={content.reviews.cta.href}>
                {content.reviews.cta.label}
                <Icon name="arrow" />
              </a>
            </div>
          </div>
          <ReviewMarquee reviews={content.reviews.items} />
        </section>

        <section
          className={`${styles.section} ${styles.contact}`}
          id="contact"
          aria-labelledby="pl-contact-title"
        >
          <div className={styles.container}>
            <div className={styles.contactGrid}>
              <div className={styles.contactCopy}>
                <p className={styles.eyebrow}>
                  <span />
                  Devis et projet
                </p>
                <h2 id="pl-contact-title">{content.contact.title}</h2>
                <p>{content.contact.body}</p>
                <div className={styles.contactInfo}>
                  {content.contact.info.map((item) => {
                    const detail = (
                      <>
                        <Icon name={item.icon} />
                        <span>
                          <small>{item.label}</small>
                          <strong>{item.value}</strong>
                        </span>
                      </>
                    );
                    return item.href ? (
                      <a href={item.href} key={item.label}>
                        {detail}
                      </a>
                    ) : (
                      <div key={item.label}>{detail}</div>
                    );
                  })}
                </div>
              </div>
              <QuoteForm content={content.contact.form} variant="contact" />
            </div>
          </div>
        </section>
      </main>
      <div className={styles.mobileCta}>
        <a href="tel:+33123456789">
          <Icon name="phone" />
          Appeler
        </a>
        <a href="#contact">Demander un devis</a>
      </div>
      <PlomberieFooter />
    </>
  );
}

function SectionHeader({
  title,
  highlightedWord,
  subtitle,
  titleId,
}: {
  title: string;
  highlightedWord: string;
  subtitle: string;
  titleId: string;
}) {
  return (
    <div className={styles.sectionHeader}>
      <p className={styles.eyebrow}>
        <span />
        Savoir-faire
      </p>
      <h2 id={titleId}>
        {title}
        <span>{highlightedWord}</span>
      </h2>
      <p>{subtitle}</p>
    </div>
  );
}

function QuoteForm({
  content,
  variant,
}: {
  content: {
    title: string;
    highlightedWord?: string;
    fields: QuoteFormField[];
    submitLabel: string;
  };
  variant: "hero" | "contact";
}) {
  const [submitted, setSubmitted] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.currentTarget.reset();
    setSubmitted(true);
  };
  return (
    <form
      className={`${styles.form} ${variant === "hero" ? styles.formHero : styles.formContact}`}
      onSubmit={submit}
    >
      <p className={styles.formLabel}>Démo locale</p>
      <h2>
        {content.title}{" "}
        {content.highlightedWord ? (
          <span>{content.highlightedWord}</span>
        ) : null}
      </h2>
      <div className={styles.formGrid}>
        {content.fields.map((field) => (
          <FormField field={field} key={field.label} variant={variant} />
        ))}
      </div>
      <button type="submit">
        {content.submitLabel}
        <Icon name="send" />
      </button>
      {submitted ? (
        <p className={styles.formNotice} role="status">
          Demande enregistrée dans cette démo. Aucun message n’a été envoyé.
        </p>
      ) : (
        <p className={styles.formHint}>
          Aucun envoi externe depuis cette démo.
        </p>
      )}
    </form>
  );
}

function FormField({
  field,
  variant,
}: {
  field: QuoteFormField;
  variant: string;
}) {
  const id = `${variant}-${field.label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")}`;
  const wide = field.type === "textarea" || field.type === "select";
  return (
    <label
      className={
        wide ? `${styles.formField} ${styles.formFieldWide}` : styles.formField
      }
      htmlFor={id}
    >
      <span>
        {field.label}
        {field.required ? " *" : ""}
      </span>
      {field.type === "select" ? (
        <select id={id} required={field.required} defaultValue="">
          <option value="">
            {field.placeholder ?? "Sélectionnez une option"}
          </option>
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea
          id={id}
          placeholder={field.placeholder}
          required={field.required}
          rows={4}
        />
      ) : (
        <input
          id={id}
          placeholder={field.placeholder}
          required={field.required}
          type={field.type}
        />
      )}
    </label>
  );
}

function StatCard({ item }: { item: StatItem }) {
  return (
    <article className={styles.stat}>
      <Icon name={item.icon} />
      <div>
        <strong>{item.value}</strong>
        <span>{item.label}</span>
      </div>
    </article>
  );
}

function ReviewMarquee({ reviews }: { reviews: PlumbingReview[] }) {
  if (reviews.length === 0) {
    return null;
  }

  return (
    <div
      aria-label="Aperçu de démonstration des avis Google Maps"
      className={styles.reviewMarquee}
      role="region"
      tabIndex={0}
    >
      <div className={styles.reviewTrack}>
        <div className={styles.reviewSet}>
          {reviews.map((review) => (
            <ReviewCard key={`${review.name}-${review.location}`} review={review} />
          ))}
        </div>
        <div aria-hidden="true" className={styles.reviewSet}>
          {reviews.map((review) => (
            <ReviewCard
              key={`duplicate-${review.name}-${review.location}`}
              review={review}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: PlumbingReview }) {
  return (
    <figure className={styles.review}>
      <div className={styles.stars} aria-label="Note de 5 sur 5">
        ★★★★★
      </div>
      <blockquote>« {review.text} »</blockquote>
      <figcaption>
        <strong>{review.name}</strong>
        <span>
          {review.location} · {review.date}
        </span>
      </figcaption>
    </figure>
  );
}

function Icon({ name }: { name: string }) {
  const common = {
    "aria-hidden": true,
    className: iconStyles.icon,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2,
    viewBox: "0 0 24 24",
  };
  const paths: Record<string, ReactNode> = {
    phone: (
      <path
        d={[
          "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 ",
          "19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3 ",
          "a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9 ",
          "a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7 ",
          "A2 2 0 0 1 22 16.9Z",
        ].join("")}
      />
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 5 7 7-7 7" />
      </>
    ),
    check: (
      <>
        <path d="m20 6-11 11-5-5" />
        <circle cx="12" cy="12" r="10" />
      </>
    ),
    send: (
      <>
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </>
    ),
    mail: (
      <>
        <rect height="16" rx="2" width="20" x="2" y="4" />
        <path d="m22 7-10 6L2 7" />
      </>
    ),
    award: (
      <>
        <circle cx="12" cy="8" r="6" />
        <path d="M15.5 13.2 17 22l-5-3-5 3 1.5-8.8" />
      </>
    ),
    pipe: (
      <>
        <path d="M4 5h8v5h4a4 4 0 0 1 4 4v5" />
        <path d="M4 10h8" />
        <path d="M17 19h6" />
      </>
    ),
    wrench: (
      <path d="M14.7 6.3a4 4 0 0 0-5 5L3 18v3h3l6.7-6.7a4 4 0 0 0 5-5l-2.4 2.4-3-3Z" />
    ),
    gear: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path
          d={[
            "M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1 ",
            "a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1 ",
            "a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1 ",
            "A1.7 1.7 0 0 0 4.6 15 1.7 1.7 0 0 0 3 14H3a2 2 0 1 1 0-4h.1 ",
            "a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1 ",
            "A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3V3a2 2 0 1 1 4 0v.1 ",
            "a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1 ",
            "a1.7 1.7 0 0 0-.3 1.8 1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.1 ",
            "a1.7 1.7 0 0 0-1.5 1Z",
          ].join("")}
        />
      </>
    ),
    home: (
      <>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v11h14V10" />
        <path d="M9 21v-6h6v6" />
      </>
    ),
    flame: (
      <path d="M8.5 14.5A4.5 4.5 0 0 0 12 22a7 7 0 0 0 7-7c0-4-3-7-7-13-.5 3-2.5 4.5-4 6.2a6.8 6.8 0 0 0 .5 6.3Z" />
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  };
  return (
    <svg {...common}>{paths[name] ?? <circle cx="12" cy="12" r="10" />}</svg>
  );
}
