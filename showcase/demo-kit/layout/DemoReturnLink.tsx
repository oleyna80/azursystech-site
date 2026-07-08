import { getDemoReturnHref } from '@/lib/demo-return-url'

export function DemoReturnLink() {
  return (
    <a className="demo-return" href={getDemoReturnHref()} aria-label="Retour au site principal">
      <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M19 12H5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m12 19-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="demo-return__full">Retour au site</span>
      <span className="demo-return__short">Retour</span>
    </a>
  )
}
