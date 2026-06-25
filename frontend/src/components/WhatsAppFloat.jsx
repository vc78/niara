import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppFloat = () => {
  const phoneNumber = '919030423317';
  const message = encodeURIComponent("Hi Navya! I found you on Sree Vastra. I'd like to know more about your collection.");
  const waUrl = "https://wa.me/$phoneNumber?text=$message";

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-green-600 hover:scale-105 transition-all duration-300"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
};

export default WhatsAppFloat;
