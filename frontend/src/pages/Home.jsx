import React, { useState, useEffect } from 'react';
import { Play, ArrowRight, Heart, MessageSquare, Globe, Video, Scissors, RefreshCcw, Star, X, Package, ShoppingBag, Eye, Tag, Sparkles, Check, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import QuickViewModal from '../components/QuickViewModal';
import CategorySlider from '../components/CategorySlider';
import './Home.css';

const BANNER_COUPONS = [
  {
    code: 'FESTIVE25',
    title: 'Festive Grand Luxe',
    discount: '25% OFF',
    percent: 25,
    bannerImg: '/banners/b1.png',
    desc: '25% off on our signature festive & bridal couture collection',
    badge: 'Grand Festive'
  },
  {
    code: 'LABEL20',
    title: 'Heritage Label Special',
    discount: '20% OFF',
    percent: 20,
    bannerImg: '/banners/b2.png',
    desc: '20% off across all handcrafted artisanal sets and sarees',
    badge: 'Popular Pick'
  },
  {
    code: 'WELCOME15',
    title: 'Welcome Trousseau',
    discount: '15% OFF',
    percent: 15,
    bannerImg: '/banners/b3.png',
    desc: '15% instant discount on your very first couture order',
    badge: 'New User'
  },
  {
    code: 'FREESHIP',
    title: 'Express Ship + ₹500 OFF',
    discount: '₹500 OFF',
    percent: 0,
    flatDiscount: 500,
    bannerImg: '/banners/b4.png',
    desc: 'Free worldwide express delivery plus ₹500 instant off',
    badge: 'Worldwide'
  }
];

const Home = ({ onAuthOpen, onProfileOpen, onNavigateToCollection, onProductClick, onApplyCoupon }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();
  const [copiedCoupon, setCopiedCoupon] = useState('');

  const copyCoupon = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCoupon(code);
      addToast(`Coupon ${code} copied! Tap Apply to use it.`, 'success');
      window.setTimeout(() => setCopiedCoupon(''), 2000);
    } catch {
      addToast(`Code: ${code}`, 'info');
    }
  };

  const handleApplyClick = (code) => {
    if (onApplyCoupon) {
      onApplyCoupon(code);
      addToast(`Applied ${code}! Price updated in bag. ✨`, 'success');
    }
  };

  // Quick View State
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroSlides = [
    {
      image: "/hero-bg.jpg",
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
    const message = encodeURIComponent(messageParam || 'Hello LABEL by SAHITHI NANDAN team, I would like to inquire about a custom order.');
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

      {/* SECTION 1.5: TRUST STRIP & BOOKING MODAL */}
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

      {/* SECTION 2: CATEGORY SLIDER (DIPPED IN LOVE) */}
      <CategorySlider onNavigateToCollection={onNavigateToCollection} />

      <QuickViewModal
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        product={quickViewProduct}
        onNavigateToProduct={onProductClick}
      />

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

      {/* SECTION 2.5: INTERACTIVE BANNER COUPONS & OFFERS (Task 2) */}
      <section className="promotional-offers" id="offers">
        {/* Headline Scroller */}
        <div className="promo-scroller-container">
          <div className="promo-scroller-content">
            <span className="scroller-item">WORLDWIDE SHIPPING</span>
            <span className="scroller-separator">•</span>
            <span className="scroller-item">FESTIVE25 FOR 25% OFF</span>
            <span className="scroller-separator">•</span>
            <span className="scroller-item">PREMIUM FABRICS</span>
            <span className="scroller-separator">•</span>
            <span className="scroller-item">LABEL20 FOR 20% OFF</span>
            <span className="scroller-separator">•</span>
            <span className="scroller-item">BESPOKE BRIDAL WEAR</span>
            <span className="scroller-separator">•</span>
            <span className="scroller-item">WELCOME15 FOR 15% OFF</span>
            <span className="scroller-separator">•</span>
            <span className="scroller-item">CUSTOM TAILORING AVAILABLE</span>
            <span className="scroller-separator">•</span>
            <span className="scroller-item">FREESHIP FOR EXPRESS SHIP + ₹500 OFF</span>
            {/* Duplicate for infinite effect */}
            <span className="scroller-item" aria-hidden="true">WORLDWIDE SHIPPING</span>
            <span className="scroller-separator" aria-hidden="true">•</span>
            <span className="scroller-item" aria-hidden="true">FESTIVE25 FOR 25% OFF</span>
            <span className="scroller-separator" aria-hidden="true">•</span>
            <span className="scroller-item" aria-hidden="true">PREMIUM FABRICS</span>
            <span className="scroller-separator" aria-hidden="true">•</span>
            <span className="scroller-item" aria-hidden="true">LABEL20 FOR 20% OFF</span>
            <span className="scroller-separator" aria-hidden="true">•</span>
            <span className="scroller-item" aria-hidden="true">BESPOKE BRIDAL WEAR</span>
            <span className="scroller-separator" aria-hidden="true">•</span>
            <span className="scroller-item" aria-hidden="true">WELCOME15 FOR 15% OFF</span>
            <span className="scroller-separator" aria-hidden="true">•</span>
            <span className="scroller-item" aria-hidden="true">CUSTOM TAILORING AVAILABLE</span>
            <span className="scroller-separator" aria-hidden="true">•</span>
            <span className="scroller-item" aria-hidden="true">FREESHIP FOR EXPRESS SHIP + ₹500 OFF</span>
          </div>
        </div>

        {/* Section Header */}
        <div className="section-header center" style={{ marginTop: '28px', marginBottom: '24px' }}>
          <span className="section-eyebrow" style={{ color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '12px', fontWeight: 700 }}>Exclusive Vouchers</span>
          <h2 style={{ margin: '6px 0 8px' }}>Festive & Couture Offers</h2>
          <p>Tap any voucher to apply live discount in your cart instantly</p>
        </div>

        {/* Interactive Banner Coupons Grid (b1 - b4) */}
        <div className="banner-coupons-grid">
          {BANNER_COUPONS.map((coupon, idx) => (
            <motion.div
              key={coupon.code}
              className="banner-coupon-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
            >
              <div className="banner-coupon-img-wrap">
                <img
                  src={coupon.bannerImg}
                  alt={`${coupon.title} Banner`}
                  className="banner-coupon-img"
                  loading="lazy"
                />
                <div className="banner-badge-tag">{coupon.badge}</div>
                <div className="banner-discount-overlay">{coupon.discount}</div>
              </div>

              <div className="banner-coupon-content">
                <div className="banner-code-header">
                  <h3 className="banner-coupon-title">{coupon.title}</h3>
                  <span className="banner-code-pill">{coupon.code}</span>
                </div>
                <p className="banner-coupon-desc">{coupon.desc}</p>

                <div className="banner-coupon-actions">
                  <button
                    type="button"
                    className="banner-apply-btn"
                    onClick={() => handleApplyClick(coupon.code)}
                  >
                    <Sparkles size={15} /> Apply Code
                  </button>
                  <button
                    type="button"
                    className="banner-copy-btn"
                    onClick={() => copyCoupon(coupon.code)}
                    title="Copy coupon code"
                  >
                    {copiedCoupon === coupon.code ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 3: EDITORIAL ABOUT & MARQUEE */}
      <section className="editorial-about" id="about">
        <div className="about-grid">
          <div className="about-image about-image-logo">
            <img src="/logos/logo1.png" alt="LABEL by SAHITHI NANDAN" className="founder-logo-img" />
          </div>
          <div className="about-text">
            <h2>From Passion to Profession</h2>
            <p className="subtitle">Meet Sahithi Garlapati — the heart behind LABEL by SAHITHI NANDAN</p>
            <p className="body">
              LABEL by SAHITHI NANDAN was born from a deep love for elegant, custom-made clothing. Founder and Chief Designer Sahithi Garlapati brings a personal touch to every luxurious design.
            </p>
            <blockquote style={{ borderLeft: '2px solid var(--accent-gold)', paddingLeft: '15px', margin: '20px 0', fontStyle: 'italic', color: 'var(--accent-gold)' }}>
              "Quality is most important — that's our motto."
            </blockquote>
            <img src="/assets/signature.png" alt="Founder Signature" className="signature-img" onError={(e) => e.target.style.display = 'none'} />
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
            <img src="/images/i5.png" alt="Kurta Sets" />
            <div className="masonry-overlay">
              <h3>Kurta Sets</h3>
              <span>Explore {'>'}</span>
            </div>
          </div>
          <div className="masonry-item" onClick={() => onNavigateToCollection('lehengas')}>
            <img src="/images/i9.png" alt="Lehengas" />
            <div className="masonry-overlay">
              <h3>Lehengas</h3>
              <span>Explore {'>'}</span>
            </div>
          </div>
          <div className="masonry-item" onClick={() => onNavigateToCollection('co-ords')}>
            <img src="/images/i8.png" alt="Co-ords" />
            <div className="masonry-overlay">
              <h3>Pre Draped</h3>
              <span>Explore {'>'}</span>
            </div>
          </div>
          <div className="masonry-item" onClick={() => onNavigateToCollection('festive-wear')}>
            <img src="/images/i6.png" alt="Festive Wear" />
            <div className="masonry-overlay">
              <h3>Combo & Festive</h3>
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
            <div key={product.id} className="product-card" onClick={() => onProductClick && onProductClick(product)}>
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
                    aria-label="Add to Wishlist"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product);
                      addToast(isInWishlist(product.id) ? `Removed from wishlist` : `Added ${product.name} to wishlist ❤️`, 'info');
                    }}
                  >
                    <Heart fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                  </button>
                  <div className="overlay-actions-row">
                    <button className="add-to-cart-btn-overlay" onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product, product.sizes?.[0] || "Free Size", 1);
                      addToast(`${product.name} added to cart!`, 'success');
                    }}>
                      <ShoppingBag size={16} /> Add to Cart
                    </button>
                    <button className="whatsapp-btn-overlay" onClick={(e) => {
                      e.stopPropagation();
                      setQuickViewProduct(product);
                      setIsQuickViewOpen(true);
                    }}>
                      <Eye size={16} /> Quick View
                    </button>
                  </div>
                </div>
              </div>
              <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <div className="product-price">
                  {product.discountPercent > 0 && (
                    <span className="original-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                  )}
                  <span className="selling-price">₹{product.sellingPrice.toLocaleString('en-IN')}</span>
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
            <a href="https://www.instagram.com/label_by_sahithi_nandan/" target="_blank" rel="noopener noreferrer" className="view-all-link">
              Follow Us <ArrowRight size={16} />
            </a>
          </div>
          <div className="insta-grid">
            <div className="insta-item"><img src="/images/i1.png" alt="Insta 1" /></div>
            <div className="insta-item"><img src="/images/i2.png" alt="Insta 2" /></div>
            <div className="insta-item"><img src="/images/i5.png" alt="Insta 3" /></div>
            <div className="insta-item"><img src="/images/i9.png" alt="Insta 4" /></div>
          </div>
        </div>

        <div className="testimonials">
          <div className="section-header">
            <h2>Client Love</h2>
          </div>
          <div className="testimonial-cards">
            <div className="test-card">
              <div className="stars"><Star size={16} /><Star size={16} /><Star size={16} /><Star size={16} /><Star size={16} /></div>
              <p className="test-text">"The lehenga I ordered was absolutely breathtaking. The fit was perfect even though we only did measurements over video call!"</p>
              <p className="test-author">- Priya S., London</p>
            </div>
            <div className="test-card staggered">
              <div className="stars"><Star size={16} /><Star size={16} /><Star size={16} /><Star size={16} /><Star size={16} /></div>
              <p className="test-text">"Amazing quality and such a seamless process. Sahithi's team was super responsive."</p>
              <p className="test-author">- Anjali R., New York</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
