import { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Menu, X, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { motion } from 'framer-motion';
import logo from '../assets/logo.jpg';
import './Navbar.css';

const Navbar = ({ onCartOpen, onWishlistOpen, onAuthOpen, onProfileOpen }) => {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { wishlist } = useWishlist();

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;

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
    <motion.nav 
      className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="navbar-container">
        {/* Brand Logo */}
        <a href="#home" className="navbar-logo">
          <img src={logo} alt="Niara by Neenu Logo" className="navbar-logo-img" />
          <span>Niara by <span className="gold-text">Neenu</span></span>
        </a>

        {/* Desktop Navigation Links */}
        <div className="navbar-links">
          <a href="#home" className="nav-link">Home</a>
          <a href="#shop" className="nav-link">Collection</a>
          <a href="#how-to-order" className="nav-link">How to Order</a>
          <a href="#about" className="nav-link">Designer</a>
          <a href="#contact" className="nav-link">Contact</a>
        </div>

        {/* Navigation Action Buttons */}
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
            <a href="#about" onClick={handleMobileLinkClick} className="mobile-nav-link">Designer</a>
            <a href="#contact" onClick={handleMobileLinkClick} className="mobile-nav-link">Contact</a>
            
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
  );
};

export default Navbar;
