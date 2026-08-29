import { Instagram, MessageSquare, MapPin, Globe, Video, Package, Mail } from 'lucide-react';
import './Footer.css';

const Footer = ({ onNavigateToHome, onNavigateToCollection, onNavigateToSection, onNavigateToGallery, onNavigateToAbout, onContactOpen }) => {
  const currentYear = new Date().getFullYear();
  const whatsappPhone = '919000164752';

  const handleWhatsAppContact = (e) => {
    e.preventDefault();
    const message = encodeURIComponent('Hello LABEL by SAHITHI NANDAN team, I would like to inquire about a custom order.');
    window.open(`https://wa.me/${whatsappPhone}?text=${message}`, '_blank');
  };

  const handleNavClick = (e, callback) => {
    e.preventDefault();
    callback();
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Column 1: Brand */}
        <div className="footer-brand">
          <div className="footer-brand-heading">
            <img src="/logos/logo1.png" alt="LABEL by SAHITHI NANDAN logo" />
            <h3>LABEL by SAHITHI NANDAN</h3>
          </div>
          <p className="footer-tagline">
            Contemporary Ethnic & Festive Fusion. Handcrafted with elegance, designed just for you.
          </p>
          <div className="social-links">
            <a href="https://www.instagram.com/label_by_sahithi_nandan/" target="_blank" rel="noopener noreferrer" aria-label="Follow on Instagram">
              <Instagram size={18} />
            </a>
            <a href="#whatsapp" onClick={handleWhatsAppContact} aria-label="Contact on WhatsApp">
              <MessageSquare size={18} />
            </a>
            <a href="https://maps.app.goo.gl/DYnpiRtkERaKnSmA6" target="_blank" rel="noopener noreferrer" aria-label="Find us on Google Maps">
              <MapPin size={18} />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul className="footer-nav">
            <li><a href="#home" onClick={(e) => handleNavClick(e, onNavigateToHome)}>Home</a></li>
            <li><a href="#shop" onClick={(e) => handleNavClick(e, () => onNavigateToCollection('all'))}>Collection</a></li>
            <li><a href="#how-to-order" onClick={(e) => handleNavClick(e, () => onNavigateToSection('how-to-order'))}>How to Order</a></li>
            <li><a href="#international" onClick={(e) => handleNavClick(e, () => onNavigateToSection('international'))}>International Orders</a></li>
            {onNavigateToGallery && (
              <li><a href="#gallery" onClick={(e) => handleNavClick(e, onNavigateToGallery)}>Gallery</a></li>
            )}
            {onNavigateToAbout && (
              <li><a href="#about" onClick={(e) => handleNavClick(e, onNavigateToAbout)}>About Designer</a></li>
            )}
            {onContactOpen && (
              <li><a href="#contact" onClick={(e) => handleNavClick(e, onContactOpen)}>Contact Us</a></li>
            )}
          </ul>
        </div>

        {/* Column 3: Categories */}
        <div className="footer-categories">
          <h4>Categories</h4>
          <ul className="footer-nav">
            <li><a href="#shop" onClick={(e) => handleNavClick(e, () => onNavigateToCollection('sarees'))}>Sarees</a></li>
            <li><a href="#shop" onClick={(e) => handleNavClick(e, () => onNavigateToCollection('blouses'))}>Blouses</a></li>
            <li><a href="#shop" onClick={(e) => handleNavClick(e, () => onNavigateToCollection('kurta-sets'))}>Kurta Sets</a></li>
            <li><a href="#shop" onClick={(e) => handleNavClick(e, () => onNavigateToCollection('lehengas'))}>Lehengas</a></li>
            <li><a href="#shop" onClick={(e) => handleNavClick(e, () => onNavigateToCollection('co-ords'))}>Pre Draped</a></li>
            <li><a href="#shop" onClick={(e) => handleNavClick(e, () => onNavigateToCollection('dresses'))}>Dresses</a></li>
            <li><a href="#shop" onClick={(e) => handleNavClick(e, () => onNavigateToCollection('men'))}>Men</a></li>
            <li><a href="#shop" onClick={(e) => handleNavClick(e, () => onNavigateToCollection('festive-wear'))}>Combo & Festive</a></li>
          </ul>
        </div>

        {/* Column 4: Contact & Offerings */}
        <div className="footer-contact">
          <h4>Reach Out</h4>
          <ul className="footer-contact-list">
            <li>
              <MessageSquare size={16} />
              <span>9000164752 (WhatsApp)</span>
            </li>
            <li>
              <Instagram size={16} />
              <span>@label_by_sahithi_nandan</span>
            </li>
            <li>
              <Mail size={16} />
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
              <a className="footer-location-card" href="https://maps.app.goo.gl/DYnpiRtkERaKnSmA6" target="_blank" rel="noopener noreferrer">
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
        <p>© {currentYear} LABEL by SAHITHI NANDAN. Crafted with elegance.</p>
      </div>
    </footer>
  );
};

export default Footer;
