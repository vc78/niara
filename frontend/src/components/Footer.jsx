import { Instagram, MessageSquare, Pin, MapPin, Globe, Video, Package, Mail } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const whatsappPhone = '919030423317';
  
  const handleWhatsAppContact = (e) => {
    e.preventDefault();
    const message = encodeURIComponent('Hello SREE VASTRA team, I would like to inquire about a custom order.');
    window.open(`https://wa.me/${whatsappPhone}?text=${message}`, '_blank');
  };

  return (
    <footer className="footer" style={{
      backgroundColor: 'var(--primary-color)',
      color: 'var(--bg-color)',
      padding: '80px 5% 30px',
      fontFamily: 'var(--font-sans)'
    }}>
      <div className="footer-content" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '40px',
        marginBottom: '60px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Column 1: Brand */}
        <div className="footer-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <img src="/logo.png" alt="SREE VASTRA" style={{ height: '40px', objectFit: 'contain' }} />
            <h3 style={{ 
              fontFamily: 'var(--font-serif)', 
              color: 'var(--accent-gold)',
              fontSize: '24px',
              margin: 0
            }}>
              SREE VASTRA
            </h3>
          </div>
          <p style={{ color: 'rgba(250, 248, 244, 0.8)', marginBottom: '25px', lineHeight: '1.6' }}>
            Contemporary Ethnic & Festive Fusion. Handcrafted with elegance, designed just for you.
          </p>
          <div className="social-links" style={{ display: 'flex', gap: '15px' }}>
            <a href="https://www.instagram.com/sreevastrakhammam?igsh=MWpteWRiZ2xuOTVmcg==" target="_blank" rel="noopener noreferrer" style={{
              width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--accent-gold)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)'
            }}>
              <Instagram size={18} />
            </a>
            <a href="#" onClick={handleWhatsAppContact} style={{
              width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--accent-gold)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)'
            }}>
              <MessageSquare size={18} />
            </a>
            <a href="#" style={{
              width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--accent-gold)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)'
            }}>
              <Pin size={18} />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-links">
          <h4 style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-serif)', fontSize: '20px', marginBottom: '20px' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><a href="#home" style={{ color: 'rgba(250, 248, 244, 0.8)', textDecoration: 'none' }}>Home</a></li>
            <li><a href="#shop" style={{ color: 'rgba(250, 248, 244, 0.8)', textDecoration: 'none' }}>Collection</a></li>
            <li><a href="#how-to-order" style={{ color: 'rgba(250, 248, 244, 0.8)', textDecoration: 'none' }}>How to Order</a></li>
            <li><a href="#international" style={{ color: 'rgba(250, 248, 244, 0.8)', textDecoration: 'none' }}>International Orders</a></li>
            <li><a href="#book-call" style={{ color: 'rgba(250, 248, 244, 0.8)', textDecoration: 'none' }}>Book a Styling Call</a></li>
            <li><a href="#about" style={{ color: 'rgba(250, 248, 244, 0.8)', textDecoration: 'none' }}>Designer</a></li>
            <li><a href="#contact" style={{ color: 'rgba(250, 248, 244, 0.8)', textDecoration: 'none' }}>Contact</a></li>
          </ul>
        </div>

        {/* Column 3: Categories */}
        <div className="footer-categories">
          <h4 style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-serif)', fontSize: '20px', marginBottom: '20px' }}>Categories</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><a href="#shop" style={{ color: 'rgba(250, 248, 244, 0.8)', textDecoration: 'none' }}>Kurta Sets</a></li>
            <li><a href="#shop" style={{ color: 'rgba(250, 248, 244, 0.8)', textDecoration: 'none' }}>Co-ords</a></li>
            <li><a href="#shop" style={{ color: 'rgba(250, 248, 244, 0.8)', textDecoration: 'none' }}>Lehengas</a></li>
            <li><a href="#shop" style={{ color: 'rgba(250, 248, 244, 0.8)', textDecoration: 'none' }}>Festive Wear</a></li>
          </ul>
        </div>

        {/* Column 4: Contact & Offerings */}
        <div className="footer-contact">
          <h4 style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-serif)', fontSize: '20px', marginBottom: '20px' }}>Reach Out</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(250, 248, 244, 0.8)' }}>
              <MessageSquare size={16} color="var(--accent-gold)" /> 
              <span>9030423317 (WhatsApp)</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(250, 248, 244, 0.8)' }}>
              <Instagram size={16} color="var(--accent-gold)" /> 
              <span>@sreevastrakhammam</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(250, 248, 244, 0.8)' }}>
              <Mail size={16} color="var(--accent-gold)" /> 
              <span>contactshubriti@gmail.com</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(250, 248, 244, 0.8)' }}>
              <Globe size={16} color="var(--accent-gold)" /> 
              <span>Shipping to 10+ countries</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(250, 248, 244, 0.8)' }}>
              <Video size={16} color="var(--accent-gold)" /> 
              <span>Free video consultation</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(250, 248, 244, 0.8)' }}>
              <Package size={16} color="var(--accent-gold)" /> 
              <span>All orders tracked & insured</span>
            </li>
            <li>
              <a href="https://share.google/RxZ8eavhBgMaCOlhl" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--white)', textDecoration: 'none', background: 'rgba(255,255,255,0.08)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(201, 168, 76, 0.3)', transition: 'all 0.3s ease', marginTop: '10px' }}>
                <MapPin size={20} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} /> 
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: '500', marginBottom: '4px', letterSpacing: '0.5px' }}>Visit Our Flagship Studio</span>
                  <span style={{ fontSize: '12px', color: 'var(--accent-gold)', textDecoration: 'underline' }}>Open in Google Maps</span>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom" style={{
        borderTop: '1px solid rgba(201, 168, 76, 0.2)',
        paddingTop: '25px',
        textAlign: 'center',
        marginTop: '20px',
        color: 'rgba(250, 248, 244, 0.6)',
        fontSize: '14px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <p>© {currentYear} SREE VASTRA. Crafted with ♥ in Hyderabad</p>
      </div>
    </footer>
  );
};

export default Footer;
