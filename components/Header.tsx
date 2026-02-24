'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

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
    <header
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={{
        backgroundColor: 'rgba(10,22,40,0.92)',
        borderColor: 'rgba(250,162,27,0.15)',
        boxShadow: '0 1px 0 rgba(250,162,27,0.08), 0 4px 24px rgba(0,0,0,0.5)',
      }}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="Back n' Body Hurts Podcast"
              className="h-14 w-14 transition-transform duration-300 group-hover:scale-105"
            />
            <span
              className="text-xl font-bold text-white hidden sm:inline tracking-wide"
              style={{ fontFamily: 'var(--font-barlow), sans-serif' }}
            >
              Back n&apos; Body Hurts
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="relative py-1 font-medium transition-colors text-sm tracking-wide"
                style={{ color: isActive(item.path) ? '#FAA21B' : 'rgba(255,255,255,0.7)' }}
                onMouseEnter={(e) => {
                  if (!isActive(item.path)) {
                    ;(e.currentTarget as HTMLElement).style.color = 'white'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.path)) {
                    ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'
                  }
                }}
              >
                {item.name}
                {isActive(item.path) && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full"
                    style={{ backgroundColor: '#FAA21B', boxShadow: '0 0 8px rgba(250,162,27,0.6)' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            style={{ backgroundColor: mobileMenuOpen ? 'rgba(250,162,27,0.1)' : 'transparent' }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="h-6 w-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="md:hidden overflow-hidden border-t"
              style={{ borderColor: 'rgba(250,162,27,0.15)' }}
            >
              <div className="py-4 flex flex-col gap-2">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.path}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.06, duration: 0.2 }}
                  >
                    <Link
                      href={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-lg font-medium transition-all"
                      style={
                        isActive(item.path)
                          ? {
                              backgroundColor: 'rgba(250,162,27,0.12)',
                              color: '#FAA21B',
                              border: '1px solid rgba(250,162,27,0.35)',
                            }
                          : {
                              color: 'rgba(255,255,255,0.75)',
                              border: '1px solid transparent',
                            }
                      }
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
