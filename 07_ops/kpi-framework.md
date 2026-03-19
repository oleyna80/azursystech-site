# KPI Framework — AzurSysTech

## Source Systems

- Website analytics: `02_website/analytics-spec.md`
- Launch lead log: Google Sheets via `n8n`
- GBP / reviews: `06_seo/*`
- Manual operational checks only where automation is not yet connected

## Acquisition

- website sessions / week
- homepage visits
- contact page visits
- business-page visits
- `click_phone`
- `click_whatsapp`
- form starts
- form submissions
- top lead sources in launch lead log

## Lead Pipeline

- new leads / week
- `new -> qualified` rate
- `qualified -> quote_sent` rate
- `quote_sent -> won` rate
- total open deals by stage
- total lost deals by reason
- leads in `follow_up_later`

## Response Speed

- avg. time to first response
- same-day response rate
- leads stuck in `new` over SLA
- leads stuck in `waiting_reply` over target follow-up window

## Conversion

- lead -> contacted rate
- lead -> visit_planned rate
- lead -> won rate
- quote acceptance rate

## SEO / Local Presence

- Google Business Profile views
- Google reviews total
- average review rating
- reviews collected / month
- organic sessions
- branded/direct sessions

## Retention

- repeat clients / quarter
- referral leads / month
- review request completion rate

## Initial Reporting Rule

For MVP:
- website behavior comes from site analytics
- lead and pipeline performance comes from Google Sheets until CRM phase 2
- review / GBP metrics may be tracked manually until automation is connected
