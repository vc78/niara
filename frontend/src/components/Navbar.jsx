import { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Menu, X, User, AtSign, Mail, MessageSquare } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const announcements = [
  "🌍 Now shipping worldwide — UAE · UK · USA · Australia",
  "📞 Book a FREE measurement video call with Sahithi",
  "✨ New Festive Collection dropping soon — DM to pre-order"
];

const Navbar = ({ onCartOpen, onWishlistOpen, onAuthOpen, onProfileOpen, onContactOpen, onNavigateToGallery, onNavigateToAbout }) => {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { wishlist } = useWishlist();

  // Announcement Bar State
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  useEffect(() => {
    // Check local storage for announcement preference
    const hidden = localStorage.getItem('hideAnnouncement');
    if (hidden === 'true') {
      setShowAnnouncement(false);
    }
    
    // Rotate announcements
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const hideAnnouncement = () => {
    setShowAnnouncement(false);
    localStorage.setItem('hideAnnouncement', 'true');
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const whatsappPhone = '919000164752';
  const emailAddress = 'contactshubriti@gmail.com';
  const instagramUrl = 'https://www.instagram.com/label_by_sahithi_nandan/reels/';

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent('Hello Label by Sahithi Nandhan team, I would like to inquire about a custom order.');
    window.open(`https://wa.me/${whatsappPhone}?text=${message}`, '_blank');
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <>
      <AnimatePresence>
        {showAnnouncement && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="announcement-bar"
            style={{
              backgroundColor: 'var(--primary-color)',
              color: 'var(--accent-gold)',
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              padding: '8px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
              zIndex: 1100
            }}
          >
            <div style={{ flex: 1, textAlign: 'center' }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={announcementIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: 'inline-block' }}
                >
                  {announcements[announcementIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
            <button onClick={hideAnnouncement} style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', cursor: 'pointer', display: 'flex', padding: '4px' }}>
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.nav
        className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ top: showAnnouncement && !isScrolled ? '0' : '0' }}
      >
        <div className="navbar-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '20px' }}>
          
          {/* Brand Logo (Left) */}
          <a href="#home" className="navbar-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <img 
              src="/logo.png" 
              alt="Label by Sahithi Nandhan" 
              style={{ 
                height: isScrolled ? '48px' : '64px',
                objectFit: 'contain',
                transition: 'height 0.3s ease'
              }} 
            />
          </a>

          {/* Desktop Navigation Links (Middle) */}
          <div className="navbar-links">
            <a href="#home" className="nav-link">Home</a>
            <a href="#shop" className="nav-link">Collection</a>
            <a href="#how-to-order" className="nav-link">Order</a>
            <a href="#international" className="nav-link">International</a>
            <button onClick={onNavigateToAbout} className="nav-link" style={{background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-color)'}}>About</button>
            <button onClick={onNavigateToGallery} className="nav-link" style={{background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-color)'}}>Gallery</button>
            <button onClick={onContactOpen} className="nav-link" style={{background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-color)'}}>Contact</button>
          </div>

          {/* Navigation Action Buttons (Right) */}
          <div className="navbar-actions">
            {/* User Auth Profile Trigger */}
            <div className="user-profile-wrapper"
              onMouseEnter={() => setShowUserMenu(true)}
              onMouseLeave={() => setShowUserMenu(false)}
            >
              {user ? (
                <button onClick={onProfileOpen} className="user-avatar-btn" title="View Sizing Profile">
                  {getInitials(user.name)}
                </button>
              ) : (
                <button onClick={onAuthOpen} className="cart-trigger-btn" aria-label="Sign In">
                  <User size={21} />
                </button>
              )}

              {user && showUserMenu && (
                <div className="user-dropdown">
                  <p className="user-greeting">Welcome, {user.name.split(' ')[0]}</p>
                  <button onClick={onProfileOpen} className="dropdown-action-btn">Sizing Profile</button>
                  <button onClick={logout} className="logout-btn">Sign Out</button>
                </div>
              )}
            </div>

            {/* Wishlist Icon Trigger */}
            <button onClick={onWishlistOpen} className="cart-trigger-btn" aria-label="Open wishlist">
              <Heart size={21} />
              {wishlistCount > 0 && (
                <span className="cart-badge-count">{wishlistCount}</span>
              )}
            </button>

            {/* WhatsApp Contact Trigger */}
            <button onClick={handleWhatsAppContact} className="whatsapp-contact-btn" aria-label="Contact via WhatsApp">
              <MessageSquare size={18} />
              <span>WhatsApp</span>
            </button>

            {/* Cart Icon Trigger */}
            <button onClick={onCartOpen} className="cart-trigger-btn" aria-label="Open shopping cart">
              <ShoppingCart size={21} />
              {cartItemCount > 0 && (
                <span className="cart-badge-count">{cartItemCount}</span>
              )}
            </button>

            {/* Mobile Menu Icon Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-toggle"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="mobile-menu-overlay dark-glass-panel">
            <div className="mobile-menu-links">
              <a href="#home" onClick={handleMobileLinkClick} className="mobile-nav-link">Home</a>
              <a href="#shop" onClick={handleMobileLinkClick} className="mobile-nav-link">Collection</a>
              <a href="#how-to-order" onClick={handleMobileLinkClick} className="mobile-nav-link">How to Order</a>
              <a href="#international" onClick={handleMobileLinkClick} className="mobile-nav-link">International Orders</a>
              <button className="mobile-link" onClick={() => { handleMobileLinkClick(); onNavigateToAbout(); }} style={{background: 'none', border: 'none', textAlign: 'left', padding: '15px 0', width: '100%', fontFamily: 'var(--font-sans)', fontSize: '18px', color: 'var(--text-color)'}}>About</button>
              <button className="mobile-link" onClick={() => { handleMobileLinkClick(); onNavigateToGallery(); }} style={{background: 'none', border: 'none', textAlign: 'left', padding: '15px 0', width: '100%', fontFamily: 'var(--font-sans)', fontSize: '18px', color: 'var(--text-color)'}}>Gallery</button>
              <button className="mobile-link" onClick={() => { handleMobileLinkClick(); onContactOpen(); }} style={{background: 'none', border: 'none', textAlign: 'left', padding: '15px 0', width: '100%', fontFamily: 'var(--font-sans)', fontSize: '18px', color: 'var(--text-color)'}}>Contact</button>

              {/* WhatsApp + Social Actions */}
              <div className="mobile-social-panel">
                <button onClick={() => { handleWhatsAppContact(); handleMobileLinkClick(); }} className="mobile-nav-link social-action-button">
                  <MessageSquare size={18} />
                  WhatsApp
                </button>
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="mobile-nav-link social-action-button">
                  <AtSign size={18} />
                  Instagram
                </a>
                <a href={`mailto:${emailAddress}`} className="mobile-nav-link social-action-button">
                  <Mail size={18} />
                  Email
                </a>
              </div>

              {/* Wishlist Link in Mobile menu */}
              <button onClick={() => { onWishlistOpen(); handleMobileLinkClick(); }} className="mobile-nav-link">
                My Wishlist ({wishlistCount})
              </button>

              {user ? (
                <>
                  <button onClick={() => { onProfileOpen(); handleMobileLinkClick(); }} className="mobile-nav-link text-gold">Sizing Profile</button>
                  <button onClick={() => { logout(); handleMobileLinkClick(); }} className="mobile-nav-link text-gold">Sign Out</button>
                </>
              ) : (
                <button onClick={() => { onAuthOpen(); handleMobileLinkClick(); }} className="mobile-nav-link text-gold">Sign In</button>
              )}
            </div>
          </div>
        )}
      </motion.nav>
    </>
  );
};

export default Navbar;
