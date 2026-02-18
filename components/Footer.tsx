'use client'

import Link from 'next/link'
import { Twitter, Instagram, Facebook, Youtube, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#112B4F] border-t border-[#FAA21B]/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="Back n' Body Hurts Podcast" className="h-12 w-12" />
              <span className="text-xl font-bold text-white">Back n&apos; Body Hurts</span>
            </div>
            <p className="text-white/70 mb-4 max-w-md">
              Real talk about life&apos;s aches, pains, and everything in between.
              Join us weekly for unfiltered conversations that matter.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-white/10 hover:bg-[#FAA21B] rounded-full transition-colors group" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-white/70 group-hover:text-[#112B4F]" />
              </a>
              <a href="#" className="p-2 bg-white/10 hover:bg-[#FAA21B] rounded-full transition-colors group" aria-label="Instagram">
                <Instagram className="h-5 w-5 text-white/70 group-hover:text-[#112B4F]" />
              </a>
              <a href="#" className="p-2 bg-white/10 hover:bg-[#FAA21B] rounded-full transition-colors group" aria-label="Facebook">
                <Facebook className="h-5 w-5 text-white/70 group-hover:text-[#112B4F]" />
              </a>
              <a href="#" className="p-2 bg-white/10 hover:bg-[#FAA21B] rounded-full transition-colors group" aria-label="YouTube">
                <Youtube className="h-5 w-5 text-white/70 group-hover:text-[#112B4F]" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-white/70 hover:text-[#FAA21B] transition-colors">Home</Link></li>
              <li><Link href="/episodes" className="text-white/70 hover:text-[#FAA21B] transition-colors">Episodes</Link></li>
              <li><Link href="/about" className="text-white/70 hover:text-[#FAA21B] transition-colors">About</Link></li>
              <li><a href="#subscribe" className="text-white/70 hover:text-[#FAA21B] transition-colors">Subscribe</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-4">Get in Touch</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-white/70 hover:text-[#FAA21B] transition-colors flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contact Us
                </Link>
              </li>
              <li><Link href="/guest-submission" className="text-white/70 hover:text-[#FAA21B] transition-colors">Guest Submissions</Link></li>
              <li><Link href="/sponsorship" className="text-white/70 hover:text-[#FAA21B] transition-colors">Sponsorship</Link></li>
              <li><Link href="/press-kit" className="text-white/70 hover:text-[#FAA21B] transition-colors">Press Kit</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              &copy; 2026 Back n&apos; Body Hurts Podcast. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-white/60 hover:text-[#FAA21B] transition-colors">Privacy Policy</a>
              <a href="#" className="text-white/60 hover:text-[#FAA21B] transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
