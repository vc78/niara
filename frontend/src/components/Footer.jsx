import { Instagram, MessageSquare, Pin, MapPin, Globe, Video, Package, Mail } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const whatsappPhone = '919032306961';

  const handleWhatsAppContact = (e) => {
    e.preventDefault();
    const message = encodeURIComponent('Hello SREE VASTRA team, I would like to inquire about a custom order.');
    window.open(`https://wa.me/${whatsappPhone}?text=${message}`, '_blank');
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Column 1: Brand */}
        <div className="footer-brand">
          <div className="footer-brand-heading">
            <img src="/logo.png" alt="SREE VASTRA logo" />
            <h3>SREE VASTRA</h3>
          </div>
          <p className="footer-tagline">
            Contemporary Ethnic & Festive Fusion. Handcrafted with elegance, designed just for you.
          </p>
          <div className="social-links">
            <a href="https://www.instagram.com/sreevastrakhammam?igsh=MWpteWRiZ2xuOTVmcg==" target="_blank" rel="noopener noreferrer" aria-label="Follow SREE VASTRA on Instagram">
              <Instagram size={18} />
            </a>
            <a href="#whatsapp" onClick={handleWhatsAppContact} aria-label="Contact SREE VASTRA on WhatsApp">
              <MessageSquare size={18} />
            </a>
            <a href="https://share.google/RxZ8eavhBgMaCOlhl" target="_blank" rel="noopener noreferrer" aria-label="Find SREE VASTRA on Google Maps">
              <Pin size={18} />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul className="footer-nav">
            <li><a href="#home">Home</a></li>
            <li><a href="#shop">Collection</a></li>
            <li><a href="#how-to-order">How to Order</a></li>
            <li><a href="#international">International Orders</a></li>
            <li><a href="#book-call">Book a Styling Call</a></li>
            <li><a href="#about">Designer</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        {/* Column 3: Categories */}
        <div className="footer-categories">
          <h4>Categories</h4>
          <ul className="footer-nav">
            <li><a href="#shop">Kurta Sets</a></li>
            <li><a href="#shop">Co-ords</a></li>
            <li><a href="#shop">Lehengas</a></li>
            <li><a href="#shop">Festive Wear</a></li>
          </ul>
        </div>

        {/* Column 4: Contact & Offerings */}
        <div className="footer-contact">
          <h4>Reach Out</h4>
          <ul className="footer-contact-list">
            <li>
              <MessageSquare size={16} />
              <span>9032306961 (WhatsApp)</span>
            </li>
            <li>
              <Instagram size={16} />
              <span>@sreevastrakhammam</span>
            </li>
            <li>
              <Mail size={16} />
              <span>venkatchowdary9177@gmail.com</span>
            </li>
            <li>
              <Globe size={16} />
              <span>Shipping to 10+ countries</span>
            </li>
            <li>
              <Video size={16} />
              <span>Free video consultation</span>
            </li>
            <li>
              <Package size={16} />
              <span>All orders tracked & insured</span>
            </li>
            <li>
              <a className="footer-location-card" href="https://share.google/RxZ8eavhBgMaCOlhl" target="_blank" rel="noopener noreferrer">
                <MapPin size={20} />
                <div>
                  <span>Visit Our Flagship Studio</span>
                  <small>Open in Google Maps</small>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© {currentYear} SREE VASTRA. Crafted with ♥ in Hyderabad</p>
      </div>
    </footer>
  );
};

export default Footer;
