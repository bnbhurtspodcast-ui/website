import { PublicLayoutShell } from '@/components/PublicLayoutShell'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <PublicLayoutShell>{children}</PublicLayoutShell>
}
