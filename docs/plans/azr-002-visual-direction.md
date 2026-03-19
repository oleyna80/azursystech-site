# PLAN: AZR-002 Visual Direction

## Objective

Lock a lightweight visual contract for MVP website implementation without introducing a separate Figma dependency.

This document is implementation-facing. It exists to reduce design drift across parallel page work in `web/`.

## Approved Direction

`Local Professional`

## Design Intent

- local
- trustworthy
- practical
- calm
- human
- structured

## Palette Baseline

- background: `#F6F1E8`
- surface: `#FFFDFC`
- text: `#1F2A37`
- primary accent: `#1F6F78`
- secondary accent: `#C96F4A`
- border / muted line: `#D8D0C4`

## Typography Direction

- headings: expressive but restrained serif
- body: neutral readable sans-serif
- avoid generic startup typography
- avoid decorative Riviera-style display fonts

## Layout Rules

- sections should feel calm and spacious, not dense
- content hierarchy should remain business-first
- header should stay simple and conversion-oriented
- footer should stay practical and trust-oriented
- CTA blocks should be clearly visible without becoming visually aggressive
- mobile layouts must preserve clarity and spacing rather than compressing too much content above the fold

## Header / Menu Model

- left: brand
- main navigation:
  - `Услуги`
  - `Для бизнеса`
  - `Для дома`
  - `Контакты`
- primary CTA: `Оставить заявку`
- secondary CTA: `WhatsApp`

## Reusable Module Direction

- hero blocks: clear headline + practical trust signal + CTA pair
- service cards: structured, readable, not over-decorated
- business/home split blocks: visibly distinct but part of one system
- FAQ blocks: calm accordion/list presentation
- contact strips: high clarity, high trust, minimal noise
- legal/privacy pages: clean readable content layout with restrained decoration

## Image Strategy

- prefer minimal service-oriented illustrations and icons
- prefer local atmosphere through layout and color, not through tourist-style imagery
- avoid generic stock photos
- avoid hacker/cyber visuals
- use real photos later only if they improve trust more than they add visual noise

## Visual No-Go Rules

- no generic startup purple
- no cold corporate look
- no noisy gradients
- no stock-photo clutter
- no dark-mode-first bias
- no overdecorated tourist Riviera aesthetic

## How To Use In Implementation

- agent + RooCode stream should treat this document as a visual baseline for all MVP routes
- visual review should check both content fidelity and system consistency
- later iteration is allowed, but must start from this baseline rather than ad hoc style changes
