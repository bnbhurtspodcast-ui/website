import { Mail, Twitter, Instagram, Linkedin } from "lucide-react";
import logo from "figma:asset/a1732e0d4bba6a58bd4c73a920724d82ff93b4d9.png";

export function About() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-16 text-center">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Back n' Body Hurts Podcast" className="w-32 h-32 md:w-40 md:h-40" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About Back n' Body Hurts
          </h1>
          <p className="text-xl text-[#FAA21B] font-medium leading-relaxed">
            A podcast dedicated to real, unfiltered conversations about life's challenges
          </p>
        </div>

        {/* Host Section */}
        <div className="mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#FAA21B]/30 overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3">
                <img
                  src="https://images.unsplash.com/photo-1634136941261-01d4bb876512?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2RjYXN0JTIwaG9zdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MDY3MjExNnww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Host"
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-2/3 p-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Meet Your Host
                </h2>
                <h3 className="text-xl text-[#FAA21B] font-bold mb-4">
                  Your Host Name
                </h3>
                <p className="text-white/80 mb-4 leading-relaxed">
                  A straight-talking host who isn't afraid to dive into the uncomfortable topics. 
                  With years of experience in media and a passion for authentic storytelling, 
                  our host brings raw honesty to every conversation.
                </p>
                <p className="text-white/80 mb-6 leading-relaxed">
                  No corporate speak, no sugar-coating - just real talk about the things that matter. 
                  Whether it's discussing life's struggles, celebrating wins, or tackling tough subjects, 
                  every episode is a genuine human connection.
                </p>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="p-2 bg-[#FAA21B] hover:bg-[#FAA21B]/90 rounded-full transition-colors"
                  >
                    <Twitter className="h-5 w-5 text-[#112B4F]" />
                  </a>
                  <a
                    href="#"
                    className="p-2 bg-[#FAA21B] hover:bg-[#FAA21B]/90 rounded-full transition-colors"
                  >
                    <Instagram className="h-5 w-5 text-[#112B4F]" />
                  </a>
                  <a
                    href="#"
                    className="p-2 bg-[#FAA21B] hover:bg-[#FAA21B]/90 rounded-full transition-colors"
                  >
                    <Linkedin className="h-5 w-5 text-[#112B4F]" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-white/80 leading-relaxed mb-4">
              Back n' Body Hurts was created because we're tired of the sanitized, perfect versions 
              of life we see everywhere. Real life has aches and pains - both physical and emotional - 
              and it's time we talked about them honestly.
            </p>
            <p className="text-white/80 leading-relaxed mb-4">
              Each episode, we sit down for unscripted conversations that get to the heart of what 
              it means to be human. We laugh, we vent, we share stories, and we don't pretend to 
              have all the answers. Because sometimes, the best thing you can hear is that someone 
              else gets it too.
            </p>
            <p className="text-white/80 leading-relaxed">
              Whether you're dealing with life's curveballs, celebrating small victories, or just 
              need someone real to listen to, Back n' Body Hurts is here for you.
            </p>
          </div>
        </div>

        {/* What We Cover */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">What We Cover</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Technology & Innovation",
                description: "How tech shapes our lives - for better or worse",
              },
              {
                title: "Science & Health",
                description: "Real talk about wellness, mental health, and taking care of yourself",
              },
              {
                title: "Business & Entrepreneurship",
                description: "The truth about building something from scratch",
              },
              {
                title: "Arts & Culture",
                description: "Creative expression and what moves us",
              },
              {
                title: "Environment & Sustainability",
                description: "Our planet's challenges and what we can actually do",
              },
              {
                title: "Personal Growth",
                description: "Navigating life's challenges and coming out stronger",
              },
            ].map((topic) => (
              <div key={topic.title} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border-2 border-[#FAA21B]/20 hover:border-[#FAA21B] transition-colors">
                <h3 className="font-bold text-white mb-2">{topic.title}</h3>
                <p className="text-white/70 text-sm">{topic.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="bg-[#FAA21B] rounded-2xl p-8 text-center">
          <Mail className="h-12 w-12 mx-auto mb-4 text-[#112B4F]" />
          <h2 className="text-2xl font-bold mb-4 text-[#112B4F]">Get in Touch</h2>
          <p className="mb-6 text-[#112B4F]/80 font-medium">
            Have a guest suggestion or feedback? We'd love to hear from you!
          </p>
          <a
            href="mailto:hello@backnbodyhurts.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#112B4F] text-white rounded-full font-bold hover:bg-[#112B4F]/90 transition-colors shadow-lg"
          >
            hello@backnbodyhurts.com
          </a>
        </div>
      </div>
    </div>
  );
}