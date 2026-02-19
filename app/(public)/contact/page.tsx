import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { submitContactForm } from './actions'

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const { success, error } = await searchParams

  return (
    <div className="py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {success === 'true' && (
          <div className="mb-8 px-5 py-4 rounded-xl bg-green-100 border-2 border-green-400 text-green-800 font-medium">
            Your message was sent successfully. We&apos;ll get back to you soon!
          </div>
        )}
        {error && (
          <div className="mb-8 px-5 py-4 rounded-xl bg-red-100 border-2 border-red-400 text-red-800 font-medium">
            {decodeURIComponent(error)}
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-xl text-[#FAA21B] font-medium">
            Got questions? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-[#FAA21B]/20 hover:border-[#FAA21B] transition-colors">
            <div className="w-12 h-12 bg-[#FAA21B] rounded-full flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-[#112B4F]" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Email</h3>
            <a href="mailto:info@bnbhurtspodcast.com" className="text-[#FAA21B] hover:underline">
              info@bnbhurtspodcast.com
            </a>
          </div>

          {/* <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-[#FAA21B]/20 hover:border-[#FAA21B] transition-colors">
            <div className="w-12 h-12 bg-[#FAA21B] rounded-full flex items-center justify-center mb-4">
              <Phone className="h-6 w-6 text-[#112B4F]" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Phone</h3>
            <a href="tel:+14161234567" className="text-[#FAA21B] hover:underline">
              (416) 123-4567
            </a>
          </div> */}

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-[#FAA21B]/20 hover:border-[#FAA21B] transition-colors">
            <div className="w-12 h-12 bg-[#FAA21B] rounded-full flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-[#112B4F]" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Location</h3>
            <p className="text-[#FAA21B]">Toronto, ON</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-[#112B4F] mb-6">Send us a message</h2>

          <form action={submitContactForm} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#112B4F] mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#FAA21B] focus:ring-2 focus:ring-[#FAA21B]/20 outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#112B4F] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#FAA21B] focus:ring-2 focus:ring-[#FAA21B]/20 outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-[#112B4F] mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#FAA21B] focus:ring-2 focus:ring-[#FAA21B]/20 outline-none transition-all"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[#112B4F] mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#FAA21B] focus:ring-2 focus:ring-[#FAA21B]/20 outline-none transition-all resize-none"
                placeholder="Tell us what's on your mind..."
              />
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-8 py-4 bg-[#FAA21B] text-[#112B4F] rounded-full font-bold hover:bg-[#FAA21B]/90 transition-colors shadow-lg inline-flex items-center justify-center gap-2"
            >
              <Send className="h-5 w-5" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
