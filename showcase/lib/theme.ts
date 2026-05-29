import type { DemoTheme } from './types'

/** Convert a DemoTheme to CSS custom properties scoped to [data-demo]. */
export function themeToCSSVars(t: DemoTheme): Record<string, string> {
  return {
    '--demo-primary': t.primary,
    '--demo-primary-fg': t.primaryFg,
    '--demo-accent': t.accent,
    '--demo-bg': t.bg,
    '--demo-surface': t.surface,
    '--demo-border': t.border,
    '--demo-font-heading': t.font.heading,
    '--demo-font-body': t.font.body,
    '--demo-radius': radiusValue(t.radius),
    '--demo-spacing': spacingValue(t.sectionSpacing),
    '--demo-button-style': t.buttonStyle,
    '--demo-card-style': t.cardStyle,
    '--demo-image-style': t.imageStyle,
  }
}

/** Render CSS custom properties as a style string for inline <style> injection. */
export function themeToStyleString(t: DemoTheme): string {
  const vars = themeToCSSVars(t)
  const lines = Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`)
  return `[data-demo] {\n${lines.join('\n')}\n}`
}

function radiusValue(r: DemoTheme['radius']): string {
  switch (r) {
    case 'none':  return '0'
    case 'sm':    return '0.25rem'
    case 'md':    return '0.5rem'
    case 'lg':    return '0.75rem'
    case 'full':  return '9999px'
  }
}

function spacingValue(s: DemoTheme['sectionSpacing']): string {
  switch (s) {
    case 'compact':  return '2rem'
    case 'normal':   return '4rem'
    case 'spacious': return '6rem'
  }
}
