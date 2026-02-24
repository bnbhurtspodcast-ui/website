// Written as literals so Tailwind doesn't purge the classes

export const COLUMN_COLOR_MAP: Record<string, string> = {
  gray:   'border-gray-400',
  purple: 'border-purple-400',
  blue:   'border-blue-400',
  cyan:   'border-cyan-400',
  orange: 'border-orange-400',
  yellow: 'border-yellow-400',
  red:    'border-red-400',
  pink:   'border-pink-400',
  indigo: 'border-indigo-400',
  amber:  'border-amber-400',
  green:  'border-green-400',
  teal:   'border-teal-400',
  violet: 'border-violet-400',
  lime:   'border-lime-400',
}

// Top stripe color dots for column headers
export const COLUMN_TOP_COLOR_MAP: Record<string, string> = {
  gray:   'bg-gray-400',
  purple: 'bg-purple-400',
  blue:   'bg-blue-400',
  cyan:   'bg-cyan-400',
  orange: 'bg-orange-400',
  yellow: 'bg-yellow-400',
  red:    'bg-red-400',
  pink:   'bg-pink-400',
  indigo: 'bg-indigo-400',
  amber:  'bg-amber-400',
  green:  'bg-green-400',
  teal:   'bg-teal-400',
  violet: 'bg-violet-400',
  lime:   'bg-lime-400',
}

export const LABEL_COLOR_MAP: Record<string, string> = {
  blue:   'bg-blue-400',
  green:  'bg-green-400',
  orange: 'bg-orange-400',
  purple: 'bg-purple-400',
  red:    'bg-red-400',
  yellow: 'bg-yellow-400',
}

// Legacy — kept for backwards compat (light theme)
export const PRIORITY_COLOR: Record<string, string> = {
  high:   'bg-red-100 text-red-700 border-red-300',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  low:    'bg-green-100 text-green-700 border-green-300',
}

// Glowing pills for dark-glass theme
export const PRIORITY_GLOW: Record<string, string> = {
  high:   'bg-red-500/20 text-red-400 border border-red-500/40 shadow-[0_0_8px_rgba(239,68,68,0.3)]',
  medium: 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.3)]',
  low:    'bg-green-500/20 text-green-400 border border-green-500/40 shadow-[0_0_8px_rgba(34,197,94,0.3)]',
}
