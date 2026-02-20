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

export const LABEL_COLOR_MAP: Record<string, string> = {
  blue:   'bg-blue-400',
  green:  'bg-green-400',
  orange: 'bg-orange-400',
  purple: 'bg-purple-400',
  red:    'bg-red-400',
  yellow: 'bg-yellow-400',
}

export const PRIORITY_COLOR: Record<string, string> = {
  high:   'bg-red-100 text-red-700 border-red-300',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  low:    'bg-green-100 text-green-700 border-green-300',
}
