import type {
  AutomationContent,
  DemoContent,
  DemoPage,
  DemoSite,
  FAQContent,
  FinalCTAContent,
  HeroContent,
  PlumbingLandingContent,
  ProcessContent,
  SalonBeautyContent,
  SectionConfig,
  ServiceAreaContent,
  ServicesContent,
  TrustContent,
  UrgentRequestContent,
} from '@/lib/types'
import { AutomationSection } from '../sections/AutomationSection'
import { FAQSection } from '../sections/FAQSection'
import { FinalCTASection } from '../sections/FinalCTASection'
import { HeroSection } from '../sections/HeroSection'
import { PlumbingLandingSection } from '../sections/PlumbingLandingSection'
import { ProcessSection } from '../sections/ProcessSection'
import { SalonBeautySection } from '../sections/SalonBeautySection'
import { ServiceAreaSection } from '../sections/ServiceAreaSection'
import { ServicesSection } from '../sections/ServicesSection'
import { TrustSection } from '../sections/TrustSection'
import { UrgentRequestSection } from '../sections/UrgentRequestSection'

type Props = {
  site: DemoSite
  page: DemoPage
  content: DemoContent
}

export function DemoPageRenderer({ site, page, content }: Props) {
  return (
    <main>
      {page.sections.map((section) => {
        const sectionContent = content[section.contentKey as keyof DemoContent]
        if (!sectionContent) {
          throw new Error(`Missing demo content: ${site.slug}.${section.contentKey}`)
        }

        return (
          <div data-section={section.type} key={`${section.type}-${section.contentKey}`}>
            {renderSection(section, sectionContent, site, page)}
          </div>
        )
      })}
    </main>
  )
}

function renderSection(
  section: SectionConfig,
  sectionContent: DemoContent[keyof DemoContent],
  site: DemoSite,
  page: DemoPage,
) {
  switch (section.type) {
    case 'hero':
      return <HeroSection content={sectionContent as HeroContent} site={site} />
    case 'services':
      return <ServicesSection content={sectionContent as ServicesContent} site={site} />
    case 'urgentRequest':
      return <UrgentRequestSection content={sectionContent as UrgentRequestContent} site={site} />
    case 'process':
      return <ProcessSection content={sectionContent as ProcessContent} site={site} />
    case 'serviceArea':
      return <ServiceAreaSection content={sectionContent as ServiceAreaContent} site={site} />
    case 'trust':
      return <TrustSection content={sectionContent as TrustContent} site={site} />
    case 'automation':
      return <AutomationSection content={sectionContent as AutomationContent} site={site} />
    case 'faq':
      return <FAQSection content={sectionContent as FAQContent} site={site} />
    case 'finalCta':
      return <FinalCTASection content={sectionContent as FinalCTAContent} site={site} />
    case 'plumbingLanding':
      return <PlumbingLandingSection content={sectionContent as PlumbingLandingContent} site={site} />
    case 'salonBeauty':
      return <SalonBeautySection content={sectionContent as SalonBeautyContent} pageSlug={page.slug} site={site} />
  }
}
