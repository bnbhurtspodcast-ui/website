const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-green-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-indigo-500',
  'bg-amber-500',
]

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) & 0xffff
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

export function formatDueDate(dateStr: string): { label: string; colorClass: string } {
  const [y, m, d] = dateStr.split('-').map(Number)
  const due = new Date(y, m - 1, d)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86_400_000)

  if (diffDays === 0) return { label: 'Today',           colorClass: 'text-amber-500' }
  if (diffDays === 1) return { label: 'Tomorrow',        colorClass: 'text-amber-400' }
  if (diffDays > 1)  return { label: `${diffDays}d left`, colorClass: 'text-gray-400' }
  return { label: `${Math.abs(diffDays)}d ago`,          colorClass: 'text-red-500' }
}
