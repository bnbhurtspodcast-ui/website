import { Download, FileText, Image, Video, Newspaper } from "lucide-react";
import logo from "figma:asset/a1732e0d4bba6a58bd4c73a920724d82ff93b4d9.png";

export function PressKit() {
  const handleDownload = (item: string) => {
    console.log(`Downloading: ${item}`);
    alert(`Download started: ${item}`);
  };

  return (
    <div className="py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-[#FAA21B] rounded-full flex items-center justify-center mx-auto mb-6">
            <Newspaper className="h-10 w-10 text-[#112B4F]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Press Kit
          </h1>
          <p className="text-xl text-[#FAA21B] font-medium mb-4">
            Media resources and brand assets
          </p>
          <p className="text-white/80 max-w-2xl mx-auto">
            Everything you need to write about or feature Back n' Body Hurts Podcast. 
            All assets are free to use for press and promotional purposes.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl p-8 mb-12 shadow-xl">
          <h2 className="text-2xl font-bold text-[#112B4F] mb-6">Quick Facts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-[#112B4F] mb-2">Podcast Name</h3>
              <p className="text-gray-700">Back n' Body Hurts Podcast</p>
            </div>
            <div>
              <h3 className="font-bold text-[#112B4F] mb-2">Host</h3>
              <p className="text-gray-700">Your Host Name</p>
            </div>
            <div>
              <h3 className="font-bold text-[#112B4F] mb-2">Launch Date</h3>
              <p className="text-gray-700">January 2023</p>
            </div>
            <div>
              <h3 className="font-bold text-[#112B4F] mb-2">Episode Count</h3>
              <p className="text-gray-700">150+ Episodes</p>
            </div>
            <div>
              <h3 className="font-bold text-[#112B4F] mb-2">Monthly Listeners</h3>
              <p className="text-gray-700">50,000+</p>
            </div>
            <div>
              <h3 className="font-bold text-[#112B4F] mb-2">Format</h3>
              <p className="text-gray-700">Weekly Interview & Discussion</p>
            </div>
            <div>
              <h3 className="font-bold text-[#112B4F] mb-2">Contact</h3>
              <p className="text-gray-700">hello@backnbodyhurts.com</p>
            </div>
            <div>
              <h3 className="font-bold text-[#112B4F] mb-2">Location</h3>
              <p className="text-gray-700">Los Angeles, CA</p>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-2xl p-8 mb-12 shadow-xl">
          <h2 className="text-2xl font-bold text-[#112B4F] mb-4">About the Show</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Back n' Body Hurts is a podcast that cuts through the noise to deliver real, unfiltered conversations 
            about life's challenges, successes, and everything in between. Hosted by [Host Name], each episode 
            features in-depth discussions with guests from diverse backgrounds, covering topics ranging from 
            technology and business to health, culture, and personal growth.
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            What sets Back n' Body Hurts apart is its commitment to authenticity. There's no corporate speak, 
            no sugar-coating—just honest dialogue that resonates with listeners who value substance over style. 
            With over 50,000 monthly listeners and a 4.9-star rating, the podcast has become a trusted voice 
            for those seeking meaningful content.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Since launching in 2023, Back n' Body Hurts has published 150+ episodes and continues to grow, 
            attracting a loyal audience of engaged listeners aged 25-45 who appreciate the show's no-nonsense 
            approach to important topics.
          </p>
        </div>

        {/* Logo & Branding */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Logo & Branding</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-8">
              <div className="flex justify-center mb-4 bg-gray-100 rounded-lg p-8">
                <img src={logo} alt="Back n' Body Hurts Logo" className="w-48 h-48" />
              </div>
              <h3 className="font-bold text-[#112B4F] mb-2">Primary Logo</h3>
              <p className="text-gray-700 text-sm mb-4">High resolution PNG with transparent background</p>
              <button
                onClick={() => handleDownload("Primary Logo PNG")}
                className="w-full px-4 py-3 bg-[#FAA21B] text-[#112B4F] rounded-lg font-bold hover:bg-[#FAA21B]/90 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Download className="h-5 w-5" />
                Download PNG
              </button>
            </div>

            <div className="bg-white rounded-xl p-8">
              <div className="flex justify-center mb-4 bg-[#112B4F] rounded-lg p-8">
                <img src={logo} alt="Back n' Body Hurts Logo" className="w-48 h-48" />
              </div>
              <h3 className="font-bold text-[#112B4F] mb-2">Logo on Dark Background</h3>
              <p className="text-gray-700 text-sm mb-4">Optimized for dark backgrounds</p>
              <button
                onClick={() => handleDownload("Logo Dark Background")}
                className="w-full px-4 py-3 bg-[#FAA21B] text-[#112B4F] rounded-lg font-bold hover:bg-[#FAA21B]/90 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Download className="h-5 w-5" />
                Download PNG
              </button>
            </div>
          </div>

          {/* Brand Colors */}
          <div className="mt-8 bg-white rounded-xl p-8">
            <h3 className="text-xl font-bold text-[#112B4F] mb-6">Brand Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="w-full h-24 rounded-lg mb-3" style={{ backgroundColor: "#FAA21B" }}></div>
                <p className="font-bold text-[#112B4F] text-sm">Orange</p>
                <p className="text-gray-600 text-sm font-mono">#FAA21B</p>
              </div>
              <div>
                <div className="w-full h-24 rounded-lg mb-3" style={{ backgroundColor: "#112B4F" }}></div>
                <p className="font-bold text-[#112B4F] text-sm">Navy Blue</p>
                <p className="text-gray-600 text-sm font-mono">#112B4F</p>
              </div>
              <div>
                <div className="w-full h-24 rounded-lg mb-3 border-2 border-gray-300" style={{ backgroundColor: "#FFFFFF" }}></div>
                <p className="font-bold text-[#112B4F] text-sm">White</p>
                <p className="text-gray-600 text-sm font-mono">#FFFFFF</p>
              </div>
              <div>
                <div className="w-full h-24 rounded-lg mb-3" style={{ backgroundColor: "#1a3d5f" }}></div>
                <p className="font-bold text-[#112B4F] text-sm">Accent Blue</p>
                <p className="text-gray-600 text-sm font-mono">#1a3d5f</p>
              </div>
            </div>
          </div>
        </div>

        {/* Downloadable Assets */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Downloadable Assets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-[#FAA21B]/20">
              <FileText className="h-10 w-10 text-[#FAA21B] mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Media Kit PDF</h3>
              <p className="text-white/70 text-sm mb-4">Complete press kit with all information and assets</p>
              <button
                onClick={() => handleDownload("Media Kit PDF")}
                className="px-6 py-3 bg-[#FAA21B] text-[#112B4F] rounded-full font-bold hover:bg-[#FAA21B]/90 transition-colors inline-flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-[#FAA21B]/20">
              <Image className="h-10 w-10 text-[#FAA21B] mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Host Photos</h3>
              <p className="text-white/70 text-sm mb-4">High-resolution professional headshots</p>
              <button
                onClick={() => handleDownload("Host Photos")}
                className="px-6 py-3 bg-[#FAA21B] text-[#112B4F] rounded-full font-bold hover:bg-[#FAA21B]/90 transition-colors inline-flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download ZIP
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-[#FAA21B]/20">
              <Image className="h-10 w-10 text-[#FAA21B] mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Cover Art</h3>
              <p className="text-white/70 text-sm mb-4">Podcast cover art in various sizes</p>
              <button
                onClick={() => handleDownload("Cover Art")}
                className="px-6 py-3 bg-[#FAA21B] text-[#112B4F] rounded-full font-bold hover:bg-[#FAA21B]/90 transition-colors inline-flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download ZIP
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-[#FAA21B]/20">
              <Video className="h-10 w-10 text-[#FAA21B] mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Promo Videos</h3>
              <p className="text-white/70 text-sm mb-4">Short promotional clips for social media</p>
              <button
                onClick={() => handleDownload("Promo Videos")}
                className="px-6 py-3 bg-[#FAA21B] text-[#112B4F] rounded-full font-bold hover:bg-[#FAA21B]/90 transition-colors inline-flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download ZIP
              </button>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-[#FAA21B] rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-[#112B4F] mb-4">Media Inquiries</h2>
          <p className="text-[#112B4F]/80 mb-6 font-medium">
            For interviews, features, or additional information, please contact our media team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:press@backnbodyhurts.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#112B4F] text-white rounded-full font-bold hover:bg-[#112B4F]/90 transition-colors"
            >
              press@backnbodyhurts.com
            </a>
            <a
              href="mailto:hello@backnbodyhurts.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#112B4F] rounded-full font-bold hover:bg-white/90 transition-colors"
            >
              General Inquiries
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
