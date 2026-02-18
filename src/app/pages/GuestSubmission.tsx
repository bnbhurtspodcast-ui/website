import { Mic, Users, Calendar, Send } from "lucide-react";
import { useState } from "react";

export function GuestSubmission() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    expertise: "",
    socialMedia: "",
    topicIdea: "",
    bio: "",
    availability: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Guest submission:", formData);
    alert("Thank you for your submission! We'll review your application and get back to you soon.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      expertise: "",
      socialMedia: "",
      topicIdea: "",
      bio: "",
      availability: "",
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
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-[#FAA21B] rounded-full flex items-center justify-center mx-auto mb-6">
            <Mic className="h-10 w-10 text-[#112B4F]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Be a Guest
          </h1>
          <p className="text-xl text-[#FAA21B] font-medium mb-4">
            Share your story with our audience
          </p>
          <p className="text-white/80 max-w-2xl mx-auto">
            We're always looking for interesting people with unique perspectives and compelling stories. 
            If you think you'd be a great fit for Back n' Body Hurts, we'd love to hear from you!
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-[#FAA21B]/20 text-center">
            <Users className="h-8 w-8 text-[#FAA21B] mx-auto mb-3" />
            <h3 className="text-white font-bold mb-2">Reach 50K+ Listeners</h3>
            <p className="text-white/70 text-sm">Share your message with our engaged community</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-[#FAA21B]/20 text-center">
            <Mic className="h-8 w-8 text-[#FAA21B] mx-auto mb-3" />
            <h3 className="text-white font-bold mb-2">Professional Production</h3>
            <p className="text-white/70 text-sm">High-quality audio and editing</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-[#FAA21B]/20 text-center">
            <Calendar className="h-8 w-8 text-[#FAA21B] mx-auto mb-3" />
            <h3 className="text-white font-bold mb-2">Flexible Scheduling</h3>
            <p className="text-white/70 text-sm">Remote or in-studio options available</p>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-[#112B4F] mb-6">Guest Application</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#112B4F] mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#FAA21B] focus:ring-2 focus:ring-[#FAA21B]/20 outline-none transition-all"
                  placeholder="Your full name"
                />
              </div>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div>
                <label htmlFor="socialMedia" className="block text-sm font-medium text-[#112B4F] mb-2">
                  Social Media Handle
                </label>
                <input
                  type="text"
                  id="socialMedia"
                  name="socialMedia"
                  value={formData.socialMedia}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#FAA21B] focus:ring-2 focus:ring-[#FAA21B]/20 outline-none transition-all"
                  placeholder="@yourhandle"
                />
              </div>
            </div>

            <div>
              <label htmlFor="expertise" className="block text-sm font-medium text-[#112B4F] mb-2">
                Area of Expertise *
              </label>
              <input
                type="text"
                id="expertise"
                name="expertise"
                value={formData.expertise}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#FAA21B] focus:ring-2 focus:ring-[#FAA21B]/20 outline-none transition-all"
                placeholder="e.g., Technology, Health, Business"
              />
            </div>

            <div>
              <label htmlFor="topicIdea" className="block text-sm font-medium text-[#112B4F] mb-2">
                Proposed Topic/Discussion Idea *
              </label>
              <input
                type="text"
                id="topicIdea"
                name="topicIdea"
                value={formData.topicIdea}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#FAA21B] focus:ring-2 focus:ring-[#FAA21B]/20 outline-none transition-all"
                placeholder="What would you like to discuss?"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-[#112B4F] mb-2">
                Brief Bio *
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#FAA21B] focus:ring-2 focus:ring-[#FAA21B]/20 outline-none transition-all resize-none"
                placeholder="Tell us about yourself and why you'd be a great guest..."
              />
            </div>

            <div>
              <label htmlFor="availability" className="block text-sm font-medium text-[#112B4F] mb-2">
                Availability
              </label>
              <select
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#FAA21B] focus:ring-2 focus:ring-[#FAA21B]/20 outline-none transition-all"
              >
                <option value="">Select your availability</option>
                <option value="weekday-morning">Weekday Mornings</option>
                <option value="weekday-afternoon">Weekday Afternoons</option>
                <option value="weekday-evening">Weekday Evenings</option>
                <option value="weekend">Weekends</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-8 py-4 bg-[#FAA21B] text-[#112B4F] rounded-full font-bold hover:bg-[#FAA21B]/90 transition-colors shadow-lg inline-flex items-center justify-center gap-2"
            >
              <Send className="h-5 w-5" />
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
