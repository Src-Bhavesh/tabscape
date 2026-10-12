/** A section's accent: the title text and the line under it run from one colour to the other. */
export type Gradient = [string, string]

export interface GradientPreset {
  name: string
  colors: Gradient
}

/** The first four are the page's original section colours. */
export const GRADIENTS: GradientPreset[] = [
  { name: 'Flame', colors: ['#fc4a1a', '#f7b733'] },
  { name: 'Sky', colors: ['#0072ff', '#00c6ff'] },
  { name: 'Mint', colors: ['#11998e', '#38ef7d'] },
  { name: 'Rose', colors: ['#dd2476', '#ff512f'] },
  { name: 'Violet', colors: ['#8e2de2', '#c471f5'] },
  { name: 'Gold', colors: ['#f7971e', '#ffd200'] },
  { name: 'Lagoon', colors: ['#43cea2', '#185a9d'] },
  { name: 'Peach', colors: ['#ee9ca7', '#ffdde1'] },
  { name: 'Silver', colors: ['#bdc3c7', '#ffffff'] }
]

export const gradientCss = ([from, to]: Gradient) => `linear-gradient(to right, ${from}, ${to})`

export const sameGradient = (a: Gradient, b: Gradient) =>
  a[0].toLowerCase() === b[0].toLowerCase() && a[1].toLowerCase() === b[1].toLowerCase()
