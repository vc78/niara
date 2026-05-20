import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand identity column */}
        <div className="footer-info">
          <h3 className="footer-logo">Niara by <span className="gold-text">Neenu</span></h3>
          <p className="founder-name">Handcrafting bespoke luxury silhouettes since 2021.</p>
          <p className="founder-label">Founder & Creative Director: <strong>Neenu Ralish</strong></p>
        </div>

        {/* Quick Links Column */}
        <div className="footer-links">
          <h4>Discover</h4>
          <div className="footer-nav">
            <a href="#home">Home</a>
            <a href="#shop">Collection</a>
            <a href="#how-to-order">How to Order</a>
            <a href="#about">Our Story</a>
          </div>
        </div>

        {/* Social Connection Column */}
        <div className="footer-social">
          <h4>Connect</h4>
          <a 
            href="https://www.instagram.com/niara_by_neenu/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="instagram-link"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="insta-icon"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            @niara_by_neenu
          </a>
          <p className="contact-details">Enquiries: contact@niarabynyenu.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Niara by Neenu. Handcrafted in India. All Rights Reserved.</p>
        <button onClick={scrollToTop} className="scroll-top-btn" aria-label="Scroll to top">
          <ArrowUp size={16} />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
