import { TrendingUp, Target, Users, Zap, Send } from "lucide-react";
import { useState } from "react";

export function Sponsorship() {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    budget: "",
    goals: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sponsorship inquiry:", formData);
    alert("Thank you for your interest! Our partnerships team will contact you within 48 hours.");
    setFormData({
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      website: "",
      budget: "",
      goals: "",
      message: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-[#FAA21B] rounded-full flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="h-10 w-10 text-[#112B4F]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Sponsor Back n' Body Hurts
          </h1>
          <p className="text-xl text-[#FAA21B] font-medium mb-4">
            Reach an engaged audience that matters
          </p>
          <p className="text-white/80 max-w-2xl mx-auto">
            Partner with us to connect with 50,000+ active listeners who value authentic conversations 
            and real stories. Our audience is engaged, diverse, and ready to hear from brands they can trust.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-[#FAA21B]/20 text-center">
            <div className="text-3xl font-bold text-[#FAA21B] mb-2">50K+</div>
            <div className="text-white/80 text-sm">Monthly Listeners</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-[#FAA21B]/20 text-center">
            <div className="text-3xl font-bold text-[#FAA21B] mb-2">85%</div>
            <div className="text-white/80 text-sm">Engagement Rate</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-[#FAA21B]/20 text-center">
            <div className="text-3xl font-bold text-[#FAA21B] mb-2">25-45</div>
            <div className="text-white/80 text-sm">Target Age Range</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-[#FAA21B]/20 text-center">
            <div className="text-3xl font-bold text-[#FAA21B] mb-2">150+</div>
            <div className="text-white/80 text-sm">Episodes Published</div>
          </div>
        </div>

        {/* Sponsorship Options */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Sponsorship Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bronze */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-[#FAA21B] transition-colors">
              <h3 className="text-2xl font-bold text-[#112B4F] mb-2">Bronze</h3>
              <div className="text-3xl font-bold text-[#FAA21B] mb-6">$500<span className="text-lg text-gray-600">/episode</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-[#FAA21B] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">30-second mid-roll ad</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-[#FAA21B] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Mention in show notes</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-[#FAA21B] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Social media mention</span>
                </li>
              </ul>
              <button className="w-full px-6 py-3 bg-[#112B4F] text-white rounded-full font-bold hover:bg-[#112B4F]/90 transition-colors">
                Get Started
              </button>
            </div>

            {/* Silver */}
            <div className="bg-white rounded-2xl p-8 border-2 border-[#FAA21B] relative shadow-lg transform scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FAA21B] text-[#112B4F] px-4 py-1 rounded-full text-sm font-bold">
                POPULAR
              </div>
              <h3 className="text-2xl font-bold text-[#112B4F] mb-2">Silver</h3>
              <div className="text-3xl font-bold text-[#FAA21B] mb-6">$1,200<span className="text-lg text-gray-600">/episode</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-[#FAA21B] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">60-second pre-roll ad</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-[#FAA21B] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">30-second mid-roll ad</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-[#FAA21B] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Featured in show notes</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-[#FAA21B] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Multiple social posts</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-[#FAA21B] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Website banner placement</span>
                </li>
              </ul>
              <button className="w-full px-6 py-3 bg-[#FAA21B] text-[#112B4F] rounded-full font-bold hover:bg-[#FAA21B]/90 transition-colors shadow-lg">
                Get Started
              </button>
            </div>

            {/* Gold */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-[#FAA21B] transition-colors">
              <h3 className="text-2xl font-bold text-[#112B4F] mb-2">Gold</h3>
              <div className="text-3xl font-bold text-[#FAA21B] mb-6">$2,500<span className="text-lg text-gray-600">/episode</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-[#FAA21B] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Exclusive episode sponsor</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-[#FAA21B] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Host-read advertisements</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-[#FAA21B] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Custom integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-[#FAA21B] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">All Silver benefits</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-[#FAA21B] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Dedicated email feature</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-[#FAA21B] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Analytics & reporting</span>
                </li>
              </ul>
              <button className="w-full px-6 py-3 bg-[#112B4F] text-white rounded-full font-bold hover:bg-[#112B4F]/90 transition-colors">
                Get Started
              </button>
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
              <p className="text-white/70">Reach listeners who are actively engaged and interested in authentic content.</p>
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

        {/* Contact Form */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-[#112B4F] mb-6">Request a Sponsorship Proposal</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-[#112B4F] mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#FAA21B] focus:ring-2 focus:ring-[#FAA21B]/20 outline-none transition-all"
                  placeholder="Your company name"
                />
              </div>
              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-[#112B4F] mb-2">
                  Contact Name *
                </label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#FAA21B] focus:ring-2 focus:ring-[#FAA21B]/20 outline-none transition-all"
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#112B4F] mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#FAA21B] focus:ring-2 focus:ring-[#FAA21B]/20 outline-none transition-all"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-[#112B4F] mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#FAA21B] focus:ring-2 focus:ring-[#FAA21B]/20 outline-none transition-all"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-[#112B4F] mb-2">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#FAA21B] focus:ring-2 focus:ring-[#FAA21B]/20 outline-none transition-all"
                  placeholder="https://yourcompany.com"
                />
              </div>
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-[#112B4F] mb-2">
                  Estimated Budget
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#FAA21B] focus:ring-2 focus:ring-[#FAA21B]/20 outline-none transition-all"
                >
                  <option value="">Select a range</option>
                  <option value="under-1k">Under $1,000</option>
                  <option value="1k-5k">$1,000 - $5,000</option>
                  <option value="5k-10k">$5,000 - $10,000</option>
                  <option value="over-10k">Over $10,000</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="goals" className="block text-sm font-medium text-[#112B4F] mb-2">
                Campaign Goals *
              </label>
              <input
                type="text"
                id="goals"
                name="goals"
                value={formData.goals}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#FAA21B] focus:ring-2 focus:ring-[#FAA21B]/20 outline-none transition-all"
                placeholder="e.g., Brand awareness, lead generation, product launch"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[#112B4F] mb-2">
                Additional Information
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#FAA21B] focus:ring-2 focus:ring-[#FAA21B]/20 outline-none transition-all resize-none"
                placeholder="Tell us more about your sponsorship goals..."
              />
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-8 py-4 bg-[#FAA21B] text-[#112B4F] rounded-full font-bold hover:bg-[#FAA21B]/90 transition-colors shadow-lg inline-flex items-center justify-center gap-2"
            >
              <Send className="h-5 w-5" />
              Request Proposal
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
