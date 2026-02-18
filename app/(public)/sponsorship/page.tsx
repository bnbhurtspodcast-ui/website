import { TrendingUp, Target, Users, Zap, Send } from 'lucide-react'
import { submitSponsorshipInquiry } from './actions'

export default function SponsorshipPage() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-[#FAA21B] rounded-full flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="h-10 w-10 text-[#112B4F]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Sponsor Back n&apos; Body Hurts
          </h1>
          <p className="text-xl text-[#FAA21B] font-medium mb-4">Reach an engaged audience that matters</p>
          <p className="text-white/80 max-w-2xl mx-auto">
            Partner with us to connect with Toronto&apos;s EDM community. Our audience is engaged,
            diverse, and ready to hear from brands they can trust.
          </p>
        </div>

        {/* Sponsorship Packages */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Sponsorship Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bronze */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-[#FAA21B] transition-colors">
              <h3 className="text-2xl font-bold text-[#112B4F] mb-2">Bronze</h3>
              <div className="text-3xl font-bold text-[#FAA21B] mb-6">$500<span className="text-lg text-gray-600">/episode</span></div>
              <ul className="space-y-3 mb-8">
                {['30-second mid-roll ad', 'Mention in show notes', 'Social media mention'].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Zap className="h-5 w-5 text-[#FAA21B] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Silver */}
            <div className="bg-white rounded-2xl p-8 border-2 border-[#FAA21B] relative shadow-lg transform scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FAA21B] text-[#112B4F] px-4 py-1 rounded-full text-sm font-bold">
                POPULAR
              </div>
              <h3 className="text-2xl font-bold text-[#112B4F] mb-2">Silver</h3>
              <div className="text-3xl font-bold text-[#FAA21B] mb-6">$1,200<span className="text-lg text-gray-600">/episode</span></div>
              <ul className="space-y-3 mb-8">
                {['60-second pre-roll ad', '30-second mid-roll ad', 'Featured in show notes', 'Multiple social posts', 'Website banner placement'].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Zap className="h-5 w-5 text-[#FAA21B] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Gold */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-[#FAA21B] transition-colors">
              <h3 className="text-2xl font-bold text-[#112B4F] mb-2">Gold</h3>
              <div className="text-3xl font-bold text-[#FAA21B] mb-6">$2,500<span className="text-lg text-gray-600">/episode</span></div>
              <ul className="space-y-3 mb-8">
                {['Exclusive episode sponsor', 'Host-read advertisements', 'Custom integration', 'All Silver benefits', 'Dedicated email feature', 'Analytics & reporting'].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Zap className="h-5 w-5 text-[#FAA21B] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Why Partner With Us */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Partner With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-[#FAA21B]/20">
              <Target className="h-10 w-10 text-[#FAA21B] mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Targeted Audience</h3>
              <p className="text-white/70">Reach listeners who are actively engaged in Toronto&apos;s EDM scene.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-[#FAA21B]/20">
              <Users className="h-10 w-10 text-[#FAA21B] mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Authentic Integration</h3>
              <p className="text-white/70">Host-read ads that feel natural and resonate with our audience.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-[#FAA21B]/20">
              <TrendingUp className="h-10 w-10 text-[#FAA21B] mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Proven Results</h3>
              <p className="text-white/70">Track record of delivering measurable ROI for our partners.</p>
            </div>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-[#112B4F] mb-6">Request a Sponsorship Proposal</h2>
          <form action={submitSponsorshipInquiry} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-[#112B4F] mb-2">Company Name *</label>
                <input type="text" id="companyName" name="companyName" required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#FAA21B] focus:ring-2 focus:ring-[#FAA21B]/20 outline-none transition-all"
                  placeholder="Your company name" />
              </div>
              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-[#112B4F] mb-2">Contact Name *</label>
                <input type="text" id="contactName" name="contactName" required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#FAA21B] focus:ring-2 focus:ring-[#FAA21B]/20 outline-none transition-all"
                  placeholder="Your full name" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#112B4F] mb-2">Email Address *</label>
                <input type="email" id="email" name="email" required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#FAA21B] focus:ring-2 focus:ring-[#FAA21B]/20 outline-none transition-all"
                  placeholder="your@email.com" />
              </div>
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-[#112B4F] mb-2">Estimated Budget</label>
                <select id="budget" name="budget"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#FAA21B] focus:ring-2 focus:ring-[#FAA21B]/20 outline-none transition-all">
                  <option value="">Select a range</option>
                  <option value="under-1k">Under $1,000</option>
                  <option value="1k-5k">$1,000 - $5,000</option>
                  <option value="5k-10k">$5,000 - $10,000</option>
                  <option value="over-10k">Over $10,000</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="goals" className="block text-sm font-medium text-[#112B4F] mb-2">Campaign Goals *</label>
              <input type="text" id="goals" name="goals" required
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#FAA21B] focus:ring-2 focus:ring-[#FAA21B]/20 outline-none transition-all"
                placeholder="e.g., Brand awareness, event promotion, product launch" />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[#112B4F] mb-2">Additional Information</label>
              <textarea id="message" name="message" rows={4}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#FAA21B] focus:ring-2 focus:ring-[#FAA21B]/20 outline-none transition-all resize-none"
                placeholder="Tell us more about your sponsorship goals..." />
            </div>

            <button type="submit"
              className="w-full md:w-auto px-8 py-4 bg-[#FAA21B] text-[#112B4F] rounded-full font-bold hover:bg-[#FAA21B]/90 transition-colors shadow-lg inline-flex items-center justify-center gap-2">
              <Send className="h-5 w-5" />
              Request Proposal
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
