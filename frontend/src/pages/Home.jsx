import React, { useState, useEffect } from 'react';
import { Play, ArrowRight, Heart, MessageSquare, Globe, Video, Scissors, RefreshCcw, Star, X, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './Home.css';

const Home = ({ onAuthOpen, onProfileOpen, onNavigateToCollection }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  // Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1600&auto=format&fit=crop",
      title: "The Festive Edit",
      subtitle: "Embrace the season in our signature handcrafted ensembles."
    },
    {
      image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1600&auto=format&fit=crop",
      title: "Modern Heritage",
      subtitle: "Traditional roots, contemporary silhouettes."
    },
    {
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&auto=format&fit=crop",
      title: "Bridal Trousseau",
      subtitle: "Your dream day, woven in gold."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Marquee
  const marqueeText = "CUSTOM TAILORING AVAILABLE • WORLDWIDE SHIPPING • PREMIUM FABRICS • BESPOKE BRIDAL WEAR • ".repeat(4);

  // Helper for WhatsApp
  const handleWhatsAppContact = (messageParam) => {
    const message = encodeURIComponent(messageParam || 'Hello Label by Sahithi Nandhan team, I would like to inquire about a custom order.');
    window.open(`https://wa.me/919000164752?text=${message}`, '_blank');
  };

  // Get featured products
  const featuredProducts = products.filter(p => p.tag === 'Bestseller' || p.isNew).slice(0, 4);

  return (
    <div className="home-container">
      
      {/* SECTION 1: HERO CAROUSEL */}
      <section className="hero-carousel" id="home">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="hero-slide-bg"
            style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)), url(${heroSlides[currentSlide].image})` }}
          />
        </AnimatePresence>
        
        <div className="hero-content">
          <motion.h1 
            key={`title-${currentSlide}`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {heroSlides[currentSlide].title}
          </motion.h1>
          <motion.p
            key={`subtitle-${currentSlide}`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {heroSlides[currentSlide].subtitle}
          </motion.p>
          <motion.button 
            className="hero-cta"
            onClick={() => onNavigateToCollection('all')}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Explore Collection
          </motion.button>
        </div>

        <div className="carousel-indicators">
          {heroSlides.map((_, index) => (
            <button 
              key={index} 
              className={`indicator-dot ${currentSlide === index ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* SECTION 2: TRUST STRIP & BOOKING MODAL */}
      <div className="trust-strip" id="book-call">
        <div className="trust-item">
          <Globe size={24} />
          <span>Worldwide Shipping</span>
        </div>
        <div className="trust-item">
          <Scissors size={24} />
          <span>Custom Tailoring</span>
        </div>
        <div className="trust-item">
          <RefreshCcw size={24} />
          <span>Easy Returns</span>
        </div>
        <button className="book-call-btn" onClick={() => setIsBookingModalOpen(true)}>
          <Video size={18} /> Book a Styling Call
        </button>
      </div>

      {isBookingModalOpen && (
        <div className="modal-overlay" onClick={() => setIsBookingModalOpen(false)}>
          <motion.div 
            className="booking-modal"
            onClick={e => e.stopPropagation()}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <button className="modal-close" onClick={() => setIsBookingModalOpen(false)}><X size={24} /></button>
            
            <div className="modal-header">
              <div className="modal-icon-wrapper">
                <Video size={32} color="var(--primary-color)" />
              </div>
              <h3>Google Meet Consultation</h3>
              <p>Connect with our styling team live over Google Meet. Explore fabrics, cuts, and custom measurements from the comfort of your home.</p>
            </div>

            <div className="modal-actions-container">
              <a 
                href="https://meet.google.com/new" 
                target="_blank" 
                rel="noreferrer"
                className="btn-instant-meet" 
              >
                <Video size={18} /> Start Instant Google Meet
              </a>
              
              <div className="modal-divider"><span>OR SCHEDULE FOR LATER</span></div>

              <form className="booking-form" onSubmit={(e) => { 
                e.preventDefault(); 
                alert("Booking confirmed! A Google Meet link has been sent to your email."); 
                setIsBookingModalOpen(false); 
              }}>
                <div className="input-group">
                  <input type="text" className="premium-input" placeholder="Full Name" required />
                  <input type="email" className="premium-input" placeholder="Email Address" required />
                </div>
                <div className="input-group">
                  <input type="date" className="premium-input" required />
                  <input type="time" className="premium-input" required />
                </div>
                <button type="submit" className="btn-schedule-meet">Schedule Meet Session</button>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* SECTION 2.5: OFFERS & DISCOUNTS (WITH SCROLLER) */}
      <section className="promotional-offers">
        {/* Headline Scroller */}
        <div className="promo-scroller-container">
          <div className="promo-scroller-content">
            <span className="scroller-item">✨ EXCLUSIVE FESTIVE OFFERS LIVE ✨</span>
            <span className="scroller-item">FLAT 20% OFF ON ALL LEHENGAS</span>
            <span className="scroller-item">✨ FREE WORLDWIDE SHIPPING ON ORDERS OVER $500 ✨</span>
            <span className="scroller-item">USE CODE: SAHITHI10 FOR 10% OFF YOUR FIRST ORDER</span>
            {/* Duplicate for infinite effect */}
            <span className="scroller-item" aria-hidden="true">✨ EXCLUSIVE FESTIVE OFFERS LIVE ✨</span>
            <span className="scroller-item" aria-hidden="true">FLAT 20% OFF ON ALL LEHENGAS</span>
            <span className="scroller-item" aria-hidden="true">✨ FREE WORLDWIDE SHIPPING ON ORDERS OVER $500 ✨</span>
            <span className="scroller-item" aria-hidden="true">USE CODE: SAHITHI10 FOR 10% OFF YOUR FIRST ORDER</span>
          </div>
        </div>

        {/* Discount Cards */}
        <div className="offers-grid">
          <div className="offer-card gold-theme">
            <div className="offer-card-inner">
              <span className="offer-badge">Limited Time</span>
              <h3>Festive Special</h3>
              <div className="offer-discount">
                <span className="discount-value">20%</span>
                <span className="discount-text">OFF</span>
              </div>
              <p>On all Handcrafted Lehengas</p>
              <div className="promo-code-box">
                <span className="code">FESTIVE20</span>
                <button className="copy-btn" onClick={() => navigator.clipboard.writeText('FESTIVE20')}>Copy</button>
              </div>
            </div>
          </div>

          <div className="offer-card green-theme">
            <div className="offer-card-inner">
              <span className="offer-badge">New Users</span>
              <h3>Welcome Offer</h3>
              <div className="offer-discount">
                <span className="discount-value">10%</span>
                <span className="discount-text">OFF</span>
              </div>
              <p>On your very first purchase</p>
              <div className="promo-code-box">
                <span className="code">SAHITHI10</span>
                <button className="copy-btn" onClick={() => navigator.clipboard.writeText('SAHITHI10')}>Copy</button>
              </div>
            </div>
          </div>

          <div className="offer-card light-theme">
            <div className="offer-card-inner">
              <span className="offer-badge">Global Access</span>
              <h3>Free Shipping</h3>
              <div className="offer-discount">
                <span className="discount-value">₹0</span>
                <span className="discount-text">FEE</span>
              </div>
              <p>On international orders above ₹40,000</p>
              <div className="promo-code-box">
                <span className="code">AUTO APPLIED</span>
                <button className="copy-btn disabled">Applied</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: EDITORIAL ABOUT & MARQUEE */}
      <section className="editorial-about" id="about">
        <div className="about-grid">
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop" alt="Sahithi Nandan" />
          </div>
          <div className="about-text">
            <h2>The Art of Elegance</h2>
            <p className="subtitle">Crafted in Hyderabad, Worn Worldwide</p>
            <p className="body">
              Label by Sahithi Nandhan was born from a desire to blend traditional Indian craftsmanship with modern, wearable silhouettes. Every piece tells a story of heritage, reimagined for the contemporary woman.
            </p>
            <p className="body">
              We believe in slow fashion, meticulous embroidery, and fabrics that feel as luxurious as they look. Whether it's a vibrant festive co-ord or a bespoke bridal lehenga, our commitment is to make you feel extraordinary.
            </p>
            <img src="/assets/signature.png" alt="Sahithi Nandhan" className="signature-img" onError={(e) => e.target.style.display='none'} />
          </div>
        </div>
        
        <div className="marquee-container">
          <div className="marquee-content">
            {marqueeText}
          </div>
        </div>
      </section>

      {/* SECTION 4: CURATED COLLECTIONS (SPA Routing Entry) */}
      <section className="curated-collections" id="shop">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <button className="view-all-link" onClick={() => onNavigateToCollection('all')}>
            View Full Collection <ArrowRight size={16} />
          </button>
        </div>
        
        <div className="masonry-grid">
          <div className="masonry-item item-large" onClick={() => onNavigateToCollection('kurta-sets')}>
            <img src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600" alt="Kurta Sets" />
            <div className="masonry-overlay">
              <h3>Kurta Sets</h3>
              <span>Explore {'>'}</span>
            </div>
          </div>
          <div className="masonry-item" onClick={() => onNavigateToCollection('lehengas')}>
            <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600" alt="Lehengas" />
            <div className="masonry-overlay">
              <h3>Lehengas</h3>
              <span>Explore {'>'}</span>
            </div>
          </div>
          <div className="masonry-item" onClick={() => onNavigateToCollection('co-ords')}>
            <img src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600" alt="Co-ords" />
            <div className="masonry-overlay">
              <h3>Co-ords</h3>
              <span>Explore {'>'}</span>
            </div>
          </div>
          <div className="masonry-item" onClick={() => onNavigateToCollection('festive-wear')}>
            <img src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600" alt="Festive Wear" />
            <div className="masonry-overlay">
              <h3>Festive Wear</h3>
              <span>Explore {'>'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: FEATURED PIECES */}
      <section className="featured-pieces">
        <div className="section-header center">
          <h2>Featured Pieces</h2>
          <p>Hand-picked favorites for the season</p>
        </div>

        <div className="products-grid featured-grid">
          {featuredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image-wrap">
                <img src={product.image} alt={product.name} loading="lazy" />
                {product.discountPercent > 0 && (
                  <span className="discount-badge">{product.discountPercent}% OFF</span>
                )}
                {(product.tag || product.isNew) && (
                  <span className="product-tag">{product.tag || 'New'}</span>
                )}
                
                <div className="product-hover-overlay">
                  <button 
                    className="wishlist-btn-overlay"
                    onClick={() => toggleWishlist(product)}
                  >
                    <Heart fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                  </button>
                  <button className="whatsapp-btn-overlay" onClick={() => handleWhatsAppContact(`Hello, I am interested in ordering the ${product.name}. Could you please guide me on the next steps?`)}>
                    <MessageSquare size={16} /> WhatsApp to Order
                  </button>
                </div>
              </div>
              <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <div className="product-price">
                  {product.discountPercent > 0 && (
                    <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
                  )}
                  <span className="selling-price">₹{product.sellingPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: HOW IT WORKS TIMELINE */}
      <section className="how-it-works" id="how-to-order">
        <div className="section-header center">
          <h2>How It Works</h2>
          <p>From screen to your wardrobe in 4 simple steps</p>
        </div>
        
        <div className="timeline-container">
          <div className="timeline-line"></div>
          
          <div className="timeline-step">
            <div className="step-number">1</div>
            <h3>Explore</h3>
            <p>Browse our collection and find the perfect outfit.</p>
          </div>
          
          <div className="timeline-step">
            <div className="step-number">2</div>
            <h3>Connect</h3>
            <p>Click "WhatsApp to Order" to speak directly with our team.</p>
          </div>
          
          <div className="timeline-step">
            <div className="step-number">3</div>
            <h3>Customize</h3>
            <p>Share your measurements or book a free video styling call.</p>
          </div>
          
          <div className="timeline-step">
            <div className="step-number">4</div>
            <h3>Receive</h3>
            <p>Your custom-fit piece is handcrafted and shipped to your door.</p>
          </div>
        </div>
      </section>

      {/* SECTION 7: INTERNATIONAL SHIPPING MAP */}
      <section className="international-shipping" id="international">
        <div className="shipping-content">
          <h2>We Ship Worldwide</h2>
          <p>Whether you're in the USA, UK, Australia, or UAE, your dream outfit is just a message away. We offer secure international shipping with tracking.</p>
          <ul className="shipping-perks">
            <li><Globe size={18} /> Delivery to 10+ countries</li>
            <li><Package size={18} /> Fully tracked & insured parcels</li>
            <li><MessageSquare size={18} /> Dedicated support team</li>
          </ul>
          <button className="shipping-cta" onClick={() => handleWhatsAppContact("Hello, I would like to get more details about your international shipping and delivery times.")}>
            Chat About Shipping
          </button>
        </div>
        <div className="shipping-map">
          <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop" alt="World Map" />
        </div>
      </section>

      {/* SECTION 8: INSTAGRAM & TESTIMONIALS */}
      <section className="social-proof-section">
        <div className="instagram-feed">
          <div className="section-header">
            <h2>@label_by_sahithi_nandan</h2>
            <a href="https://www.instagram.com/label_by_sahithi_nandan/reels/" target="_blank" rel="noopener noreferrer" className="view-all-link">
              Follow Us <ArrowRight size={16} />
            </a>
          </div>
          <div className="insta-grid">
            <div className="insta-item"><img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400" alt="Insta 1"/></div>
            <div className="insta-item"><img src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400" alt="Insta 2"/></div>
            <div className="insta-item"><img src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400" alt="Insta 3"/></div>
            <div className="insta-item"><img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400" alt="Insta 4"/></div>
          </div>
        </div>

        <div className="testimonials">
          <div className="section-header">
            <h2>Client Love</h2>
          </div>
          <div className="testimonial-cards">
            <div className="test-card">
              <div className="stars"><Star size={16}/><Star size={16}/><Star size={16}/><Star size={16}/><Star size={16}/></div>
              <p className="test-text">"The lehenga I ordered was absolutely breathtaking. The fit was perfect even though we only did measurements over video call!"</p>
              <p className="test-author">- Priya S., London</p>
            </div>
            <div className="test-card staggered">
              <div className="stars"><Star size={16}/><Star size={16}/><Star size={16}/><Star size={16}/><Star size={16}/></div>
              <p className="test-text">"Amazing quality and such a seamless process ordering from the US. Sahithi's team was super responsive."</p>
              <p className="test-author">- Anjali R., New York</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
