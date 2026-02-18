'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Episodes', path: '/episodes' },
    { name: 'About', path: '/about' },
  ]

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  return (
    <header className="sticky top-0 z-50 bg-[#112B4F]/95 backdrop-blur-md border-b border-[#FAA21B]/20">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Back n' Body Hurts Podcast" className="h-14 w-14" />
            <span className="text-xl font-bold text-white hidden sm:inline">Back n&apos; Body Hurts</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`transition-colors font-medium ${
                  isActive(item.path)
                    ? 'text-[#FAA21B]'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <a
              href="#subscribe"
              className="px-5 py-2.5 rounded-full bg-[#FAA21B] text-[#112B4F] font-bold hover:bg-[#FAA21B]/90 transition-all shadow-lg"
            >
              Subscribe
            </a>
            <Link
              href="/admin/signin"
              className="px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm text-white font-bold hover:bg-white/20 transition-all border border-white/20"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#FAA21B]/20">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                    isActive(item.path)
                      ? 'bg-[#FAA21B] text-[#112B4F]'
                      : 'text-white/80 hover:bg-[#112B4F]/50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <a
                href="#subscribe"
                className="mx-4 px-4 py-2 rounded-full bg-[#FAA21B] text-[#112B4F] font-bold text-center"
              >
                Subscribe
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
