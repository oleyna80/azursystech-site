import type { DemoSite } from '@/lib/types'

type Props = {
  site: DemoSite
}

export function DemoFooter({ site }: Props) {
  if (site.footer) {
    return (
      <footer className="demo-footer">
        <div className="demo-footer__inner">
          <div className="demo-footer__brand">
            <strong>{site.title}</strong>
            <span>{site.footer.description}</span>
            <div className="demo-footer__social" aria-label="Réseaux sociaux">
              <a href="#contact">f</a>
              <a href="#contact">ig</a>
              <a href="#contact">wa</a>
            </div>
          </div>
          {site.footer.columns.map((column) => (
            <div className="demo-footer__column" key={column.title}>
              <strong>{column.title}</strong>
              {column.links.map((link) => (
                <a href={link.href} key={link.label}>
                  {link.label}
                </a>
              ))}
            </div>
          ))}
          {site.footer.certification ? (
            <div className="demo-footer__column demo-footer__cert">
              <strong>{site.footer.certification.title}</strong>
              {site.footer.certification.items.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          ) : null}
        </div>
        <div className="demo-footer__bottom">
          <span>{site.footer.copyright}</span>
          <div>
            {site.footer.legalLinks.map((link) => (
              <a href={link.href} key={link.label}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="demo-footer">
      <strong>{site.title}</strong>
      <span>Демо-шаблон AzurSysTech · финальные условия подтверждаются специалистом.</span>
    </footer>
  )
}
