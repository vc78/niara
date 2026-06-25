import React from 'react';
import { Instagram, MessageSquare, MapPin, Globe, Video, Package, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 px-4 md:px-10 lg:px-16 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {/* Col 1: Brand */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xl font-bold text-white font-[Playfair Display]">SREE VASTRA</h3>
          <p className="text-sm text-gray-400 max-w-xs">
            Quality is most important — that's our motto.<br/>
            By Navya Sri Namburi.
          </p>
        </div>

        {/* Col 2: Quick Links */}
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-1">Quick Links</h4>
          {['Collections', 'Our Story', 'Size Chart', 'Visit Us'].map(link => (
            <a key={link} href={# + link.toLowerCase().replace(' ', '-')} className="text-sm text-gray-400 hover:text-white transition">
              {link}
            </a>
          ))}
        </div>

        {/* Col 3: Contact */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-1">Contact</h4>
          <a href="https://wa.me/919030423317" className="inline-flex items-center gap-2 text-sm text-[#25D366] hover:underline">
            ?? +91 90304 23317
          </a>
          <p className="text-xs text-gray-500 mt-2">
            Made with ?? by Navya Sri Namburi
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
