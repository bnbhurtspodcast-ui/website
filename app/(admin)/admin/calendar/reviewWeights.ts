export const REVIEW_WEIGHTS = {
  sound:      0.30,
  vibes:      0.30,
  production: 0.20,
  venue:      0.15,
  cost:       0.05,
} as const

export const REVIEW_DESCRIPTIONS: Record<keyof typeof REVIEW_WEIGHTS, string> = {
  sound:      'Incorporates the journey set list, the new IPs, and how it resonates with you.',
  vibes:      'The energy, showmanship, PLURR and the smiles of the crowd and DJ.',
  production: 'The lazers, visuals, stage design and lighting.',
  venue:      'The logistics, bar service, hospitality, and security.',
  cost:       'Is it worth all from the money that you put in, 1 star is not worth it and 5 is most worth it.',
}
