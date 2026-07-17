import type { Lang } from './types'
import { agents, ui } from './data'
import { ContactForm } from './ContactForm'
import tk from './tokens.module.css'
import styles from './contact.module.css'

type ContactPageProps = { lang: Lang }

export function ContactPage({ lang }: ContactPageProps) {
  const t = ui[lang]

  return (
    <div className={styles.page}>
      <div className={`${tk.container} ${styles.pageInner}`}>
        <div className={styles.pageInfo}>
          <p className={styles.pageLabel}>Contact</p>
          <h1 className={styles.pageTitle}>{t.contact.title}</h1>
          <p className={styles.pageSubtitle}>{t.contact.subtitle}</p>

          <div className={styles.pageAgents}>
            {agents.map((agent) => (
              <div key={agent.id} className={styles.pageAgent}>
                <p className={styles.pageAgentName}>{agent.name}</p>
                <p className={styles.pageAgentRole}>{agent.role[lang]}</p>
                <div className={styles.pageAgentContact}>
                  <a href={`tel:${agent.phone.replace(/\s/g, '')}`} className={styles.pageAgentLink}>
                    {agent.phone}
                  </a>
                  <a href={`mailto:${agent.email}`} className={styles.pageAgentLink}>
                    {agent.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.formContainer}>
          <ContactForm lang={lang} />
        </div>
      </div>
    </div>
  )
}
