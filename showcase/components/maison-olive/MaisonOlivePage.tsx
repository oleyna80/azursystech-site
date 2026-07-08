'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import tokenStyles from './tokens.module.css'
import buttonStyles from './buttons.module.css'
import styles from './page.module.css'

type MenuSection = 'entrees' | 'plats' | 'desserts'

type MenuDish = {
  name: string
  desc: string
  price: string
  image: string
  alt: string
  tag?: string
}

const MENU_DATA: Record<MenuSection, MenuDish[]> = {
  entrees: [
    {
      name: 'Tartare de tomates anciennes',
      desc: 'Tomates coeur de boeuf, basilic frais, fleur de sel de Camargue, huile d\'olive pressée à froid',
      price: '16 €',
      tag: 'Végétarien',
      image: '/demo/maison-olive/dish-tomato-tartare.webp',
      alt: 'Tartare de tomates anciennes',
    },
    {
      name: 'Carpaccio de bar de ligne',
      desc: 'Agrumes de Menton, huile d\'olive, câpres de Pantelleria, herbes fraîches',
      price: '22 €',
      image: '/demo/maison-olive/dish-sea-bass-carpaccio.webp',
      alt: 'Carpaccio de bar de ligne',
    },
    {
      name: 'Velouté de pois chiches',
      desc: 'Cumin doux, coriandre fraîche, citron confit, huile de sésame torréfié',
      price: '14 €',
      tag: 'Végétalien',
      image: '/demo/maison-olive/dish-chickpea-veloute.webp',
      alt: 'Velouté de pois chiches',
    },
  ],
  plats: [
    {
      name: 'Filet de loup de mer rôti',
      desc: 'Fenouil braisé au pastis, jus réduit au citron, tapenade verte maison',
      price: '32 €',
      image: '/demo/maison-olive/dish-roasted-sea-bass.webp',
      alt: 'Filet de loup de mer rôti',
    },
    {
      name: 'Agneau de Sisteron',
      desc: 'Aubergine confite au four, jus au thym, olives niçoises, herbes de Provence',
      price: '38 €',
      image: '/demo/maison-olive/dish-sisteron-lamb.webp',
      alt: 'Agneau de Sisteron',
    },
    {
      name: 'Risotto aux herbes du jardin',
      desc: 'Parmesan 24 mois, beurre noisette, basilic et cerfeuil fraîchement cueillis',
      price: '26 €',
      tag: 'Végétarien',
      image: '/demo/maison-olive/dish-herb-risotto.webp',
      alt: 'Risotto aux herbes du jardin',
    },
  ],
  desserts: [
    {
      name: 'Tarte au citron de Menton',
      desc: 'Meringue légère au chalumeau, crème yuzu, zeste confit',
      price: '14 €',
      image: '/demo/maison-olive/dish-menton-lemon-tart.webp',
      alt: 'Tarte au citron de Menton',
    },
    {
      name: 'Panna cotta à la fleur d\'oranger',
      desc: 'Compotée de figues violettes, crumble aux amandes grillées',
      price: '12 €',
      image: '/demo/maison-olive/dish-orange-blossom-panna-cotta.webp',
      alt: 'Panna cotta à la fleur d\'oranger',
    },
    {
      name: 'Fromages affinés',
      desc: 'Sélection du jour, confiture de cerises d\'Apt, pain aux noix',
      price: '18 €',
      image: '/demo/maison-olive/dish-aged-cheeses.webp',
      alt: 'Fromages affinés',
    },
  ],
}

const GALLERY_ITEMS = [
  { src: '/demo/maison-olive/hero-restaurant-interior-thumb.webp', large: '/demo/maison-olive/hero-restaurant-interior.webp', alt: 'Salle du restaurant' },
  { src: '/demo/maison-olive/gallery-generous-table-thumb.webp', large: '/demo/maison-olive/gallery-generous-table-large.webp', alt: 'Table généreuse' },
  { src: '/demo/maison-olive/gallery-risotto-service-thumb.webp', large: '/demo/maison-olive/gallery-risotto-service-large.webp', alt: 'Risotto maison' },
  { src: '/demo/maison-olive/gallery-seasonal-starter-thumb.webp', large: '/demo/maison-olive/gallery-seasonal-starter-large.webp', alt: 'Entrée de saison' },
  { src: '/demo/maison-olive/gallery-evening-terrace-thumb.webp', large: '/demo/maison-olive/gallery-evening-terrace-large.webp', alt: 'Terrasse en soirée' },
  { src: '/demo/maison-olive/gallery-fresh-ingredients-thumb.webp', large: '/demo/maison-olive/gallery-fresh-ingredients-large.webp', alt: 'Ingrédients frais' },
]

const HOURS = [
  { day: 'Lundi', time: 'Fermé' },
  { day: 'Mardi – Jeudi', time: '12:00 — 14:30 · 19:00 — 22:30' },
  { day: 'Vendredi – Samedi', time: '12:00 — 14:30 · 19:00 — 23:30' },
  { day: 'Dimanche', time: '12:00 — 14:30' },
]

export function MaisonOlivePage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<MenuSection>('entrees')
  const [scrolled, setScrolled] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIdx, setLightboxIdx] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [resFormStep, setResFormStep] = useState<'form' | 'success'>('form')
  const [resPending, setResPending] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileOpen])

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setResPending(true)
    setTimeout(() => {
      setResPending(false)
      setResFormStep('success')
      setTimeout(() => {
        setResFormStep('form')
      }, 3000)
    }, 1400)
  }

  const openLightbox = (idx: number) => {
    setLightboxIdx(idx)
    setLightboxOpen(true)
  }

  const prevLightbox = () => {
    setLightboxIdx((i) => (i - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length)
  }

  const nextLightbox = () => {
    setLightboxIdx((i) => (i + 1) % GALLERY_ITEMS.length)
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxOpen(false)
        setModalOpen(false)
        setMobileOpen(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <main className={`${tokenStyles.root} ${styles.page}`}>
      {/* Header */}
      <header
        ref={headerRef}
        className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}
        id="site-header"
      >
        <div className={`${tokenStyles.container} ${styles.headerInner}`}>
          <Link href="/demo/maison-olive" className={styles.logoLink} aria-label="La Maison des Olives">
            <OliveIcon className={styles.logoMark} />
            <div className={styles.logoText}>
              <span className={styles.logoMaison}>LA MAISON</span>
              <div className={styles.logoRule}></div>
              <em className={styles.logoOlive}>des Olives</em>
            </div>
          </Link>

          <nav className={styles.deskNav} aria-label="Navigation">
            <a href="#about">Notre histoire</a>
            <a href="#menu">La carte</a>
            <a href="#gallery">Galerie</a>
            <a href="#contact">Contact</a>
          </nav>

          <div className={styles.headerActions}>
            <button
              onClick={() => {
                setMobileOpen(false)
                setTimeout(() => {
                  document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' })
                }, 0)
              }}
              className={`${buttonStyles.btn} ${buttonStyles.btnSm} ${buttonStyles.btnPrimary} ${styles.deskCta}`}
            >
              RÉSERVER
            </button>
            <button
              className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ''}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-overlay"
              aria-label="Menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className={styles.mobileOverlay}>
          <div className={styles.logoMobile}>
            <OliveIcon className={styles.logoMarkMobile} />
            <div className={styles.logoText} style={{ alignItems: 'center' }}>
              <span className={styles.logoMaison}>LA MAISON</span>
              <div className={styles.logoRule}></div>
              <em className={styles.logoOlive}>des Olives</em>
            </div>
          </div>
          <nav>
            <a href="#about" onClick={() => setMobileOpen(false)}>Notre histoire</a>
            <a href="#menu" onClick={() => setMobileOpen(false)}>La carte</a>
            <a href="#gallery" onClick={() => setMobileOpen(false)}>Galerie</a>
            <a href="#contact" onClick={() => setMobileOpen(false)}>Contact</a>
          </nav>
          <button
            onClick={() => {
              setMobileOpen(false)
              setTimeout(() => {
                document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' })
              }, 100)
            }}
            className={`${buttonStyles.btn} ${buttonStyles.btnLg} ${buttonStyles.btnPrimary}`}
          >
            RÉSERVER UNE TABLE
          </button>
        </div>
      )}

      {/* Hero */}
      <section className={styles.hero} id="top">
        <div className={styles.heroOverlay} aria-hidden="true"></div>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>Nice · Côte d&apos;Azur</span>
          <h1>Une cuisine qui parle<br />du soleil</h1>
          <p className={styles.heroLede}>
            Cuisine méditerranéenne de saison — des producteurs locaux à votre table, dans une maison au cœur de Nice.
          </p>
          <div className={styles.heroActions}>
            <button
              onClick={() => {
                document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className={`${buttonStyles.btn} ${buttonStyles.btnLg} ${buttonStyles.btnPrimary}`}
            >
              RÉSERVER UNE TABLE
            </button>
            <button
              onClick={() => {
                document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className={`${buttonStyles.btn} ${buttonStyles.btnLg} ${buttonStyles.btnGhost}`}
            >
              VOIR LE MENU
            </button>
          </div>
        </div>
        <div className={styles.scrollIndicator} aria-hidden="true">
          <span>Découvrir</span>
          <div></div>
        </div>
      </section>

      {/* About */}
      <section id="about" className={styles.aboutSection}>
        <div className={`${tokenStyles.container} ${styles.aboutGrid}`}>
          <div className={styles.aboutText}>
            <span className={styles.kicker}>NOTRE HISTOIRE</span>
            <h2>Une adresse chaleureuse<br />au cœur de Nice</h2>
            <p>
              La Maison des Olives est née d&apos;un attachement profond à la cuisine méditerranéenne — celle des marchés du matin, des produits que l&apos;on choisit pour leur goût et non pour leur apparence, et des repas qui se prolongent naturellement.
            </p>
            <p>
              Chaque assiette est construite autour de la saisonnalité. Nous travaillons avec des producteurs locaux de la région niçoise et des pêcheurs de la Méditerranée, afin que la carte change avec les saisons.
            </p>
            <div className={styles.aboutQuote}>
              <blockquote>« Nos producteurs locaux, notre mer — c&apos;est ici que tout commence. »</blockquote>
              <cite>La Maison des Olives, Nice — depuis 2018</cite>
            </div>
          </div>
          <div className={styles.aboutImage}>
            <img
              src="/demo/maison-olive/about-kitchen-mediterranean.webp"
              alt="Cuisine méditerranéenne"
              loading="lazy"
            />
            <div className={styles.aboutImageAccent} aria-hidden="true"></div>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className={styles.menuSection}>
        <div className={tokenStyles.container}>
          <div className={styles.sectionHeading}>
            <span className={styles.kicker}>NOTRE CARTE</span>
            <h2>De saison, de la mer</h2>
            <p>La carte évolue chaque semaine selon les arrivages et les saisons.</p>
          </div>

          <div className={styles.menuTabs}>
            <div className={styles.tabGroup}>
              {(['entrees', 'plats', 'desserts'] as const).map((tab) => (
                <button
                  key={tab}
                  className={`${styles.tabBtn} ${activeMenu === tab ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveMenu(tab)}
                >
                  {tab === 'entrees' ? 'Entrées' : tab === 'plats' ? 'Plats' : 'Desserts'}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.menuPanel}>
            {MENU_DATA[activeMenu].map((dish, i) => (
              <div key={i} className={styles.dishCard}>
                <div className={styles.dishCardImgWrap}>
                  <img className={styles.dishCardImg} src={dish.image} alt={dish.alt} loading="lazy" />
                </div>
                <div className={styles.dishCardBody}>
                  <div className={styles.dishCardHd}>
                    <div>
                      <h3 className={styles.dishName}>{dish.name}</h3>
                    </div>
                    <span className={styles.dishPrice}>{dish.price}</span>
                  </div>
                  <p className={styles.dishDesc}>{dish.desc}</p>
                  {dish.tag ? <span className={styles.dishTag}>{dish.tag}</span> : null}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.menuCta}>
            <button
              onClick={() => setModalOpen(true)}
              className={`${buttonStyles.btn} ${buttonStyles.btnSecondary}`}
            >
              Voir le menu complet
            </button>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className={styles.gallerySection}>
        <div className={tokenStyles.container}>
          <div className={styles.sectionHeading} style={{ marginBottom: '48px' }}>
            <span className={styles.kicker}>GALERIE</span>
            <h2>L&apos;atmosphère de la maison</h2>
          </div>

          <div className={styles.galleryGrid}>
            {GALLERY_ITEMS.map((item, i) => (
              <button
                key={i}
                className={styles.galleryItem}
                onClick={() => openLightbox(i)}
                aria-label={item.alt}
              >
                <img src={item.src} alt={item.alt} loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className={styles.lightbox}>
          <button
            className={styles.lightboxClose}
            onClick={() => setLightboxOpen(false)}
            aria-label="Fermer"
          >
            ✕
          </button>
          <figure className={styles.lightboxFigure}>
            <img
              src={GALLERY_ITEMS[lightboxIdx].large}
              alt={GALLERY_ITEMS[lightboxIdx].alt}
              className={styles.lightboxImg}
            />
            <figcaption className={styles.lightboxCaption}>
              {GALLERY_ITEMS[lightboxIdx].alt}
            </figcaption>
          </figure>
          <button
            className={`${styles.lightboxBtn} ${styles.lightboxPrev}`}
            onClick={prevLightbox}
            aria-label="Précédent"
          >
            ‹
          </button>
          <button
            className={`${styles.lightboxBtn} ${styles.lightboxNext}`}
            onClick={nextLightbox}
            aria-label="Suivant"
          >
            ›
          </button>
          <div className={styles.lightboxCounter}>
            {lightboxIdx + 1} / {GALLERY_ITEMS.length}
          </div>
        </div>
      )}

      {/* Reservation */}
      <section id="reservation" className={styles.reservationSection}>
        <div className={styles.reservationWrap}>
          <div className={styles.sectionHeading} style={{ marginBottom: '48px' }}>
            <span className={`${styles.kicker} ${styles.kickerGreen}`}>RÉSERVATION</span>
            <h2>Réserver une table</h2>
            <p>
              Nous confirmons votre réservation par email dans les 24 heures. Pour les groupes de plus de 8 personnes,
              merci de nous contacter directement.
            </p>
          </div>

          <div className={styles.reservationCard}>
            {resFormStep === 'form' ? (
              <form className={styles.resForm} onSubmit={handleReservationSubmit}>
                <div className={styles.formRow2}>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel} htmlFor="r-name">
                      Nom complet<span className={styles.req}>*</span>
                    </label>
                    <input
                      id="r-name"
                      name="name"
                      type="text"
                      className={styles.fieldInput}
                      placeholder="Jean Dupont"
                      autoComplete="name"
                      required
                    />
                    <span className={styles.fieldErr}>Ce champ est requis.</span>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel} htmlFor="r-email">
                      Adresse email<span className={styles.req}>*</span>
                    </label>
                    <input
                      id="r-email"
                      name="email"
                      type="email"
                      className={styles.fieldInput}
                      placeholder="jean@exemple.fr"
                      autoComplete="email"
                      required
                    />
                    <span className={styles.fieldErr}>Adresse email invalide.</span>
                  </div>
                </div>

                <div className={styles.formRow3}>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel} htmlFor="r-date">
                      Date<span className={styles.req}>*</span>
                    </label>
                    <input
                      id="r-date"
                      name="date"
                      type="text"
                      className={styles.fieldInput}
                      placeholder="JJ/MM/AAAA"
                      pattern="\d{2}/\d{2}/\d{4}"
                      inputMode="numeric"
                      autoComplete="off"
                      required
                    />
                    <span className={styles.fieldErr}>Format attendu : JJ/MM/AAAA.</span>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel} htmlFor="r-time">
                      Heure<span className={styles.req}>*</span>
                    </label>
                    <select id="r-time" name="time" className={styles.fieldSelect} required>
                      <option value="">Choisir</option>
                      <option>12:00</option>
                      <option>12:30</option>
                      <option>13:00</option>
                      <option>13:30</option>
                      <option>14:00</option>
                      <option>19:00</option>
                      <option>19:30</option>
                      <option>20:00</option>
                      <option>20:30</option>
                      <option>21:00</option>
                      <option>21:30</option>
                      <option>22:00</option>
                    </select>
                    <span className={styles.fieldErr}>Ce champ est requis.</span>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel} htmlFor="r-guests">
                      Couverts
                    </label>
                    <select id="r-guests" name="guests" className={styles.fieldSelect} defaultValue="2">
                      <option value="1">1 personne</option>
                      <option value="2">2 personnes</option>
                      <option value="3">3 personnes</option>
                      <option value="4">4 personnes</option>
                      <option value="5">5 personnes</option>
                      <option value="6">6 personnes</option>
                      <option value="7">7 personnes</option>
                      <option value="8">8 personnes</option>
                    </select>
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.fieldLabel} htmlFor="r-msg">Message (facultatif)</label>
                  <textarea
                    id="r-msg"
                    name="message"
                    className={styles.fieldTextarea}
                    placeholder="Occasion spéciale, allergies, préférence de placement..."
                    rows={3}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className={`${buttonStyles.btn} ${buttonStyles.btnLg} ${buttonStyles.btnPrimary} ${buttonStyles.btnFull}`}
                  disabled={resPending}
                >
                  {resPending ? 'En cours...' : 'ENVOYER LA DEMANDE'}
                </button>
              </form>
            ) : (
              <div className={styles.resSuccess}>
                <div className={styles.successIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3>Demande envoyée</h3>
                <p>Merci ! Nous avons bien reçu votre demande. Nous vous confirmerons la réservation par email.</p>
                <button
                  type="button"
                  className={`${buttonStyles.btn} ${buttonStyles.btnMd} ${buttonStyles.btnSecondary}`}
                  onClick={() => setResFormStep('form')}
                >
                  NOUVELLE RÉSERVATION
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className={styles.contactSection}>
        <div className={`${tokenStyles.container} ${styles.contactGrid}`}>
          <div className={styles.contactCol}>
            <h3>Nous trouver</h3>
            <div className={styles.contactItems}>
              <div className={styles.contactItem}>
                <MapIcon />
                <div className={styles.contactItemText}>
                  {'2 Rue de la Paix\n06000 Nice, France'}
                </div>
              </div>
              <div className={styles.contactItem}>
                <PhoneIcon />
                <div className={styles.contactItemText}>+33 (0)4 93 00 00 00</div>
              </div>
              <div className={styles.contactItem}>
                <MailIcon />
                <div className={styles.contactItemText}>contact@lamaisondeszolives.fr</div>
              </div>
            </div>
          </div>

          <div className={styles.contactCol}>
            <h3>Horaires</h3>
            <div className={styles.hoursList}>
              {HOURS.map((h, i) => (
                <div key={i} className={styles.hoursRow}>
                  <span className={styles.hoursDay}>{h.day}</span>
                  <span className={`${styles.hoursTime} ${h.time === 'Fermé' ? styles.hoursOff : ''}`}>
                    {h.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.contactCol}>
            <h3>Plan d&apos;accès</h3>
            <div className={styles.mapPlaceholder}>
              <div className={styles.mapPin}>
                <div className={styles.mapPinIcon}>
                  <MapPinIcon />
                </div>
                <div className={styles.mapPinName}>La Maison des Olives</div>
                <div className={styles.mapPinAddr}>2 Rue de la Paix, Nice</div>
                <a href="#contact" className={styles.mapOpen}>
                  Ouvrir dans Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal - Full Menu */}
      {modalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setModalOpen(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Menu complet</h2>
              <button
                className={styles.modalClose}
                onClick={() => setModalOpen(false)}
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              {Object.entries(MENU_DATA).map(([section, items]) => (
                <div key={section} className={styles.modalSection}>
                  <div className={styles.modalSectionHd}>
                    {section === 'entrees' ? 'Entrées' : section === 'plats' ? 'Plats' : 'Desserts'}
                  </div>
                  {items.map((dish, i) => (
                    <div key={i} className={styles.modalDish}>
                      <div className={styles.modalDishInfo}>
                        <div className={styles.modalDishName}>{dish.name}</div>
                        <div className={styles.modalDishDesc}>{dish.desc}</div>
                      </div>
                      <div className={styles.modalDishRight}>
                        <div className={styles.modalDishPrice}>{dish.price}</div>
                        {dish.tag ? <div className={styles.modalDishTag}>{dish.tag}</div> : null}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerGrid}>
            <div>
              <Link href="/demo/maison-olive" className={styles.footerLogo}>
                <OliveIcon className={styles.footerLogoMark} />
                <div className={styles.logoText}>
                  <span className={styles.logoMaison}>LA MAISON</span>
                  <div className={styles.logoRule}></div>
                  <em className={styles.logoOlive}>des Olives</em>
                </div>
              </Link>
              <p className={styles.footerDesc}>
                Une cuisine méditerranéenne de saison, construite autour de producteurs locaux. À Nice depuis 2018.
              </p>
            </div>

            <div>
              <div className={styles.footerColLbl}>Navigation</div>
              <nav className={styles.footerNav}>
                <a href="#about">Notre histoire</a>
                <a href="#menu">La carte</a>
                <a href="#gallery">Galerie</a>
                <a href="#contact">Contact</a>
              </nav>
            </div>

            <div>
              <div className={styles.footerColLbl}>Horaires</div>
              <div className={styles.footerHrs}>
                {HOURS.map((h, i) => (
                  <div key={i} className={styles.footerHrsRow}>
                    <span className={styles.footerHrsDay}>{h.day}</span>
                    <span className={`${styles.footerHrsTime} ${h.time === 'Fermé' ? styles.footerHrsOff : ''}`}>
                      {h.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.footerDivider}></div>

          <div className={styles.footerBottom}>
            <div className={styles.footerCopy}>© 2024 La Maison des Olives. Tous droits réservés.</div>
            <div className={styles.footerLegal}>
              <a href="#contact">Mentions légales</a>
              <a href="#contact">Politique de confidentialité</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

// Icon components
function OliveIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 44 68" fill="none" aria-hidden="true">
      <g transform="translate(0,6)">
        <path
          d="M13 56 C13 51 15 48 17 44 C19 40 18 35 15 31 C12 27 7 25 2 26 C6 25 10 26 12 28 C14 24 15 18 15 12 C16 16 18 20 20 22 C21 17 23 12 25 6 C25.5 11 25 16 23 19 C25 16 29 13 33 9 C30 14 27 17 24 20 C26 24 29 26 35 27 C30 26 26 25 24 28 C23 32 24 36 26 40 C28 45 28 49 29 56 Z"
          fill="currentColor"
        />
        <path
          d="M10 56 C11 51 14 49 17 48 C19 47 20 49 21 56 Z M22 56 C23 51 25 49 27 48 C29 47 31 50 32 56 Z"
          fill="currentColor"
        />
        <ellipse cx="3" cy="23" rx="7" ry="2.5" fill="currentColor" transform="rotate(-15 3 23)" />
        <ellipse cx="7" cy="29" rx="6" ry="2.2" fill="currentColor" transform="rotate(-40 7 29)" />
        <ellipse cx="3" cy="35" rx="5.5" ry="2.0" fill="currentColor" transform="rotate(-10 3 35)" />
        <ellipse cx="8" cy="15" rx="7" ry="2.5" fill="currentColor" transform="rotate(-35 8 15)" />
        <ellipse cx="14" cy="11" rx="7.5" ry="2.8" fill="currentColor" transform="rotate(-55 14 11)" />
        <ellipse cx="22" cy="5" rx="8" ry="3.0" fill="currentColor" transform="rotate(-90 22 5)" />
        <ellipse cx="27" cy="6" rx="7" ry="2.5" fill="currentColor" transform="rotate(-75 27 6)" />
        <ellipse cx="17" cy="6" rx="7" ry="2.5" fill="currentColor" transform="rotate(-105 17 6)" />
        <ellipse cx="36" cy="15" rx="7" ry="2.5" fill="currentColor" transform="rotate(35 36 15)" />
        <ellipse cx="30" cy="11" rx="7.5" ry="2.8" fill="currentColor" transform="rotate(55 30 11)" />
        <ellipse cx="41" cy="23" rx="7" ry="2.5" fill="currentColor" transform="rotate(15 41 23)" />
        <ellipse cx="37" cy="29" rx="6" ry="2.2" fill="currentColor" transform="rotate(40 37 29)" />
        <ellipse cx="41" cy="35" rx="5.5" ry="2.0" fill="currentColor" transform="rotate(10 41 35)" />
        <ellipse cx="22" cy="17" rx="6" ry="2.4" fill="currentColor" transform="rotate(10 22 17)" />
        <ellipse cx="16" cy="21" rx="5.5" ry="2.2" fill="currentColor" transform="rotate(-30 16 21)" />
        <ellipse cx="28" cy="21" rx="5.5" ry="2.2" fill="currentColor" transform="rotate(30 28 21)" />
        <circle cx="6" cy="31" r="1.8" fill="currentColor" opacity="0.65" />
        <circle cx="38" cy="31" r="1.8" fill="currentColor" opacity="0.65" />
        <circle cx="22" cy="12" r="1.8" fill="currentColor" opacity="0.65" />
        <circle cx="13" cy="22" r="1.8" fill="currentColor" opacity="0.65" />
        <circle cx="31" cy="22" r="1.8" fill="currentColor" opacity="0.65" />
      </g>
    </svg>
  )
}

function MapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5z" />
    </svg>
  )
}
