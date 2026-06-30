import type { Metadata } from 'next'

import { AssuranceContactPage } from './AssuranceContactPage'

export const metadata: Metadata = {
  title: 'Contact | Assurance Paul Clement',
  description:
    "Page de contact demo pour le modele Assurance Paul Clement, avec formulaire local sans envoi externe.",
}

export default function Page() {
  return <AssuranceContactPage />
}
