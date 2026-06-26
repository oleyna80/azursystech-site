import type { Metadata } from 'next'
import { AssuranceHomePage } from './AssuranceHomePage'

export const metadata: Metadata = {
  title: 'Paul Clement Assurances | Demo AzursysTech',
  description: 'Demo showcase homepage for a Paris insurance advisor, ported as a live Next.js page.',
}

export default function AssuranceDemoPage() {
  return <AssuranceHomePage />
}
