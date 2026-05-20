import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, ShoppingCart, MessageCircle, ChevronDown, Check, Sparkles, Heart, Compass, ShieldCheck, ArrowLeft } from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Footer from '../components/Footer';
import BespokeImage from '../components/BespokeImage';
import './Home.css';

const Home = () => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  // Hero Carousel Images
  const heroImages = [
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=1600&auto=format&fit=crop'
  ];

  const [activeHeroIdx, setActiveHeroIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroIdx(prev => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroImages.length]);
  
  // State for Catalog
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  
  // State for Detail Modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // State for Contact Form
  const [contactName, setContactName] = useState('');
  const [contactMobile, setContactMobile] = useState('');
  const [contactInterest, setContactInterest] = useState('Sarees');
  const [contactMessage, setContactMessage] = useState('');

  // Showcase Category State
  const [selectedShowcase, setSelectedShowcase] = useState(null);

  // Video call consultation booking states
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoClientName, setVideoClientName] = useState('');
  const [videoMobile, setVideoMobile] = useState('');
  const [videoOccasion, setVideoOccasion] = useState('Wedding Bridal Couture');
  const [videoPlatform, setVideoPlatform] = useState('WhatsApp Video Call');
  const [videoSlot, setVideoSlot] = useState('Afternoon Slot (2 PM - 5 PM)');
  const [videoLanguage, setVideoLanguage] = useState('English');

  const handleVideoConsultationSubmit = (e) => {
    e.preventDefault();
    const phoneNumber = "919074450441";
    let text = `✨ *Video Styling Consultation Request - Niara by Neenu* ✨\n\n`;
    text += `• *Client Name:* ${videoClientName}\n`;
    text += `• *Mobile Number:* ${videoMobile}\n`;
    text += `• *Occasion:* ${videoOccasion}\n`;
    text += `• *Preferred Platform:* ${videoPlatform}\n`;
    text += `• *Preferred Slot:* ${videoSlot}\n`;
    text += `• *Preferred Language:* ${videoLanguage}\n\n`;
    text += `Please confirm if this slot is available to schedule. Thank you!`;
    
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedText}`, '_blank');
    setIsVideoModalOpen(false);
    setVideoClientName('');
    setVideoMobile('');
  };

  // Get exactly 20 related items for the showcase
  const get20RelatedItems = (type) => {
    if (!type) return [];
    const query = type.toLowerCase();
    
    // Filter matches
    let matches = products.filter(p => {
      const name = p.name.toLowerCase();
      const desc = p.description.toLowerCase();
      const cat = p.category.toLowerCase();
      const tag = p.tag.toLowerCase();
      return (
        name.includes(query) || 
        desc.includes(query) || 
        cat.includes(query) || 
        tag.includes(query)
      );
    });
    
    // Pad if less than 20
    if (matches.length < 20) {
      for (const p of products) {
        if (matches.length >= 20) break;
        if (!matches.some(m => m.id === p.id)) {
          matches.push(p);
        }
      }
    }
    
    return matches.slice(0, 20);
  };

  const handleOpenShowcase = (type) => {
    let title = type;
    let image = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&auto=format&fit=crop";
    let desc = "Exactly 20 exquisite handcrafted pieces curated for luxury comfort and elegance.";

    if (type.toLowerCase().includes("kanchipuram") || type.toLowerCase().includes("kanjeevaram")) {
      title = "Kanjeevaram Handloom Silk";
      image = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&auto=format&fit=crop";
      desc = "20 masterpieces woven in pure Kanchipuram mulberry silk with heavy golden zari threads, presenting the legacy of temple handlooms.";
    } else if (type.toLowerCase().includes("banarasi") || type.toLowerCase().includes("raw")) {
      title = "Royal Banarasi & Textured Silk";
      image = "https://images.unsplash.com/photo-1610030469668-93535c17b6b3?w=1600&auto=format&fit=crop";
      desc = "20 gorgeous handwoven Katan and raw silk sarees from Banaras, embroidered with floral bel patterns and royal zari pallus.";
    } else if (type.toLowerCase().includes("organza") || type.toLowerCase().includes("kora")) {
      title = "Whispering Organza & Delicate Silk";
      image = "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1600&auto=format&fit=crop";
      desc = "20 lightweight translucent silk organza drapes detailed with fine zardozi border wire and hand-guided sequins.";
    } else if (type.toLowerCase().includes("lehenga") || type.toLowerCase().includes("wedding")) {
      title = "The Bridal & Wedding Atelier";
      image = "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=1600&auto=format&fit=crop";
      desc = "20 hand-embellished heavy raw silk bridal lehengas, bridal sarees, and temple sets designed to shine on your special day.";
    } else if (type.toLowerCase().includes("gown") || type.toLowerCase().includes("festive")) {
      title = "Festive Gowns & Drapes";
      image = "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1600&auto=format&fit=crop";
      desc = "20 contemporary silhouettes including sequence cowl gowns, asymmetric satin drapes, and cocktail dresses.";
    } else if (type.toLowerCase().includes("summer") || type.toLowerCase().includes("linen")) {
      title = "Pastel Summer Meadows";
      image = "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=1600&auto=format&fit=crop";
      desc = "20 lightweight linens, soft georgettes, and pastel cotton-silks styled for high-end summer soirées.";
    } else if (type.toLowerCase().includes("sale") || type.toLowerCase().includes("mega")) {
      title = "The Curated Mega Showcase";
      image = "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=1600&auto=format&fit=crop";
      desc = "A high-end catalog featuring 20 selected items under trending luxury drapes and bespoke coordinates.";
    } else {
      title = `${type.charAt(0).toUpperCase() + type.slice(1)} Collection`;
      image = "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1600&auto=format&fit=crop";
      desc = `Explore our bespoke edition of 20 pieces showcasing premium quality, handloom craftsmanship, and custom tailoring slots.`;
    }

    setSelectedShowcase({
      type,
      title,
      image,
      desc
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sizing definitions by category
  const getSizesForCategory = (category) => {
    if (category === 'sarees') return ['Free Size'];
    if (category === 'accessories') return ['One Size'];
    return ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom Fit'];
  };

  // 1. Filter and Sort Products (Strictly 50 items)
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim() !== '') {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  // Formats price to Indian Rupee currency standard
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Open Quick View Modal
  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    const sizes = getSizesForCategory(product.category);
    setSelectedSize(sizes[0]); // Default to first available size
    setQuantity(1);
    setAddedAnimation(false);
  };

  // Add Item inside Modal
  const handleModalAddToCart = () => {
    if (!selectedProduct) return;
    addToCart(selectedProduct, selectedSize, quantity);
    
    // Trigger added success banner
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
    }, 2000);
  };

  // Quick direct single-product booking via WhatsApp
  const handleDirectWhatsAppBook = () => {
    if (!selectedProduct) return;
    
    const phoneNumber = "919074450441"; // Designer contact
    const productPriceFormatted = formatPrice(selectedProduct.price * quantity);
    
    let orderText = `✨ *Bespoke Booking Request - Niara by Neenu* ✨\n\n`;
    orderText += `Hello Neenu, I would like to instantly book this exquisite piece:\n\n`;
    orderText += `🛍️ *PRODUCT DETAILS:*\n`;
    orderText += `• Product: *${selectedProduct.name}*\n`;
    orderText += `• Category: *${selectedProduct.category.toUpperCase()}*\n`;
    orderText += `• Selected Size: *${selectedSize}*\n`;
    orderText += `• Quantity: *${quantity}*\n`;
    orderText += `• Total Price: *${productPriceFormatted}*\n\n`;
    orderText += `Please confirm tailoring availability and share payment steps. Thank you!`;

    const encodedText = encodeURIComponent(orderText);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
    
    window.open(whatsappUrl, '_blank');
  };

  // Custom Form WhatsApp inquiry
  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactName.trim() || !contactMobile.trim() || !contactMessage.trim()) return;

    const phoneNumber = "919074450441";
    let inquiryText = `✨ *Custom Styling Enquiry - Niara by Neenu* ✨\n\n`;
    inquiryText += `• *Name:* ${contactName}\n`;
    inquiryText += `• *Mobile:* ${contactMobile}\n`;
    inquiryText += `• *Interest Area:* ${contactInterest}\n`;
    inquiryText += `• *Message:* ${contactMessage}\n\n`;
    inquiryText += `I'm looking forward to design consultation details!`;

    const encodedText = encodeURIComponent(inquiryText);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
    
    window.open(whatsappUrl, '_blank');
    
    // Clear inputs
    setContactName('');
    setContactMobile('');
    setContactMessage('');
  };

  return (
    <div className="home-spa">
      
      {/* ==========================================
          ANNOUNCEMENT TICKER (Varanchi Style)
          ========================================== */}
      <div className="announcement-ticker-bar">
        <div className="ticker-wrap">
          <div className="ticker-content">
            <span>✨ SHOP BY VIDEO CALL</span>
            <span className="ticker-emblem">❖</span>
            <span>CUSTOM BESPOKE FITTINGS</span>
            <span className="ticker-emblem">❖</span>
            <span>HANDCRAFTED DESIGNER LEGACY</span>
            <span className="ticker-emblem">❖</span>
            <span>WORLDWIDE COURIER SERVICE</span>
            <span className="ticker-emblem">❖</span>
            <span>SHOP BY VIDEO CALL</span>
            <span className="ticker-emblem">❖</span>
            <span>CUSTOM BESPOKE FITTINGS</span>
            <span className="ticker-emblem">❖</span>
            <span>HANDCRAFTED DESIGNER LEGACY</span>
            <span className="ticker-emblem">❖</span>
            <span>WORLDWIDE COURIER SERVICE</span>
            <span className="ticker-emblem">❖</span>
          </div>
        </div>
      </div>
      
      {/* ==========================================
          HERO SECTION (Elegance Redefined)
          ========================================== */}
      <section id="home" className="hero-section">
        {/* Background Image Slideshow Carousel */}
        <div 
          className="hero-slider-container" 
          style={{ cursor: 'pointer' }}
          onClick={() => {
            const slideShowcases = ["kanjeevaram", "wedding", "festive", "organza", "gown"];
            handleOpenShowcase(slideShowcases[activeHeroIdx]);
          }}
          title="Click to view curated 20-piece collection"
        >
          {heroImages.map((img, idx) => (
            <div 
              key={idx}
              className={`hero-slide ${idx === activeHeroIdx ? 'active' : ''}`}
              style={{ backgroundImage: `url('${img}')` }}
            />
          ))}
        </div>
        
        <div className="hero-background-overlay" />
        
        {/* Carousel Navigation Indicators */}
        <div className="hero-slider-dots">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              className={`hero-dot ${idx === activeHeroIdx ? 'active' : ''}`}
              onClick={() => setActiveHeroIdx(idx)}
              aria-label={`Show slide ${idx + 1}`}
            />
          ))}
        </div>

        <div className="hero-content-wrapper">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="hero-inner"
          >
            <span className="hero-subtitle">Niara by Neenu</span>
            <h1 className="hero-title">Elegance <br />Redefined</h1>
            <p className="hero-description">
              Step into the world of luxury handcrafted ethnic wear, where traditional handlooms meet modern, tailored silhouettes.
            </p>
            <div className="hero-ctas">
              <a href="#shop" className="btn-primary">Explore Collection</a>
              <a href="#about" className="btn-secondary dark-secondary">Our Heritage</a>
            </div>
            <p className="hero-carousel-tip">✨ Click backdrop to discover the 20-piece curated catalog</p>
          </motion.div>
        </div>
        <div className="scroll-indicator-bar">
          <span className="scroll-text">Scroll to Discover</span>
          <div className="scroll-dot" />
        </div>
      </section>

      {selectedShowcase ? (
        /* Curated 20-piece Showcase Page */
        <div className="showcase-page-view">
          <div className="showcase-hero" style={{ backgroundImage: `url('${selectedShowcase.image}')` }}>
            <div className="showcase-hero-overlay" />
            <div className="showcase-hero-content">
              <button type="button" className="showcase-back-btn" onClick={() => setSelectedShowcase(null)}>
                <ArrowLeft size={15} /> <span>Back to Home</span>
              </button>
              <span className="showcase-tag">Niara Curated Showcase</span>
              <h1 className="showcase-title">{selectedShowcase.title}</h1>
              <p className="showcase-desc">{selectedShowcase.desc}</p>
            </div>
          </div>

          <div className="showcase-body-container">
            <div className="showcase-meta-header">
              <h2>Exquisite Creations</h2>
              <span className="items-count">Exactly 20 Curated Pieces</span>
            </div>

            <div className="products-catalog-grid">
              {get20RelatedItems(selectedShowcase.type).map((product) => (
                <motion.div 
                  key={product.id} 
                  className="product-card-container dark-glass-panel"
                  layout
                >
                  <div className="card-image-box">
                    <BespokeImage src={product.image_url} alt={product.name} className="card-visual-img" />
                    {product.tag && (
                      <span className="card-tag-lbl">{product.tag}</span>
                    )}
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                      className={`card-wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                      aria-label="Toggle wishlist"
                    >
                      <Heart size={16} className={isInWishlist(product.id) ? 'filled-heart' : ''} />
                    </button>
                    
                    {/* Hover Action Button (Centered) */}
                    <div className="hover-action-overlay">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleOpenModal(product); }} 
                        className="overlay-details-pill-btn"
                      >
                        <Eye size={16} />
                        View Details
                      </button>
                    </div>
                  </div>

                  <div className="card-details-box">
                    <span className="card-category-lbl">{product.category.toUpperCase()}</span>
                    <h3 className="card-title-lbl" onClick={() => handleOpenModal(product)}>{product.name}</h3>
                    <div className="card-price-lbl">{formatPrice(product.price)}</div>
                    
                    <div className="card-action-bar">
                      <button 
                        onClick={() => handleOpenModal(product)} 
                        className="card-quick-view-btn"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => {
                          addToCart(product, getSizesForCategory(product.category)[0], 1);
                        }}
                        className="card-add-to-cart-btn"
                        aria-label="Add to cart"
                      >
                        <ShoppingCart size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* ==========================================
              CORE PHILOSOPHY & BRAND STATEMENTS
              ========================================== */}
          <section className="philosophy-section">
        <div className="philosophy-container">
          <div className="philosophy-card">
            <div className="phi-icon-box">
              <Sparkles size={28} className="gold-icon" />
            </div>
            <h3>Bespoke Artistry</h3>
            <p>Every single garment is hand-embellished by seasoned karigars, taking up to 120 hours of delicate embroidery.</p>
          </div>
          
          <div className="philosophy-card">
            <div className="phi-icon-box">
              <Compass size={28} className="gold-icon" />
            </div>
            <h3>Made-to-Measure</h3>
            <p>Choose our Custom Fit option to have your dress tailor-made to your exact body measurements for a flawless drape.</p>
          </div>

          <div className="philosophy-card">
            <div className="phi-icon-box">
              <ShieldCheck size={28} className="gold-icon" />
            </div>
            <h3>WhatsApp Assistance</h3>
            <p>Order directly into our private designer channels. Talk details, styling, and customizations in real-time.</p>
          </div>
        </div>
      </section>

      {/* ==========================================
          PHYSICAL STUDIO EXPERIENCE BANNER (Varanchi Style)
          ========================================== */}
      <section className="studio-experience-banner">
        <div className="studio-bg-overlay" />
        <div className="studio-content">
          <h2 className="studio-title">Store Now Open</h2>
          <p className="studio-sub">Experience true craftsmanship in person at our luxury studio</p>
          <a href="https://wa.me/919074450441?text=Hello%20Neenu%2C%20I%20would%20like%20to%20schedule%20an%20in-person%20visit%20to%20your%20studio." target="_blank" rel="noopener noreferrer" className="btn-primary studio-btn">
            Visit Gurugram Studio
          </a>
        </div>
      </section>

      {/* ==========================================
          SHOP BY FABRIC (Varanchi Layout Grid)
          ========================================== */}
      <section className="shop-by-fabric-section">
        <div className="section-header">
          <h2>Shop by Fabric</h2>
          <p>Delve into the textures of our 12 signature luxury handloom materials</p>
        </div>

        <div className="fabric-grid-container">
          {/* Left Large Card */}
          <div 
            className="fabric-card large-fabric-card"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop')` }}
            onClick={() => handleOpenShowcase('kanjeevaram')}
          >
            <div className="fabric-card-overlay" />
            <div className="fabric-card-badge">NEW COLLECTION</div>
            <div className="fabric-card-content">
              <h3>Kanchipuram Silk</h3>
              <p>A legacy in silk weaves</p>
            </div>
          </div>

          {/* Right Stacked Cards */}
          <div className="fabric-stacked-container">
            <div 
              className="fabric-card small-fabric-card"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&auto=format&fit=crop')` }}
              onClick={() => handleOpenShowcase('raw silk')}
            >
              <div className="fabric-card-overlay" />
              <div className="fabric-card-badge">POPULAR</div>
              <div className="fabric-card-content">
                <h3>Raw Silk</h3>
                <p>Luxuriously Textured</p>
              </div>
            </div>

            <div 
              className="fabric-card small-fabric-card"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1590736969955-71cc94801759?w=800&auto=format&fit=crop')` }}
              onClick={() => handleOpenShowcase('kora silk')}
            >
              <div className="fabric-card-overlay" />
              <div className="fabric-card-badge">POPULAR</div>
              <div className="fabric-card-content">
                <h3>Kora Silk</h3>
                <p>Light, Airy, Delicate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Fabric Scroll List */}
        <div className="fabric-scroll-container">
          <div className="fabric-scroll-list">
            {[
              { name: 'Tissue Silk', img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=200&auto=format&fit=crop' },
              { name: 'Tussar Silk', img: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=200&auto=format&fit=crop' },
              { name: 'Soft Silk', img: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=200&auto=format&fit=crop' },
              { name: 'Katan Silk', img: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=200&auto=format&fit=crop' },
              { name: 'Chanderi Silk', img: 'https://images.unsplash.com/photo-1610030470298-0c33a903c734?w=200&auto=format&fit=crop' },
              { name: 'Organza Silk', img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=200&auto=format&fit=crop' },
              { name: 'Velvet', img: 'https://images.unsplash.com/photo-1582236353904-90409a8039bd?w=200&auto=format&fit=crop' },
              { name: 'Linen Silk', img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&auto=format&fit=crop' },
              { name: 'Georgette Silk', img: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=200&auto=format&fit=crop' },
              { name: 'Crepe Silk', img: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=200&auto=format&fit=crop' },
              { name: 'Muslin Silk', img: 'https://images.unsplash.com/photo-1610030470298-0c33a903c734?w=200&auto=format&fit=crop' },
              { name: 'Chiniya Silk', img: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=200&auto=format&fit=crop' }
            ].map((fab, idx) => (
              <div 
                key={idx} 
                className="fabric-scroll-item"
                onClick={() => handleOpenShowcase(fab.name)}
              >
                <div className="fabric-scroll-img-wrapper">
                  <BespokeImage src={fab.img} alt={fab.name} className="fabric-scroll-img" />
                </div>
                <span>{fab.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          COLLECTION / PRODUCT GALLERY
          ========================================== */}
      <section id="shop" className="shop-section">
        <div className="section-header">
          <h2>The Bespoke Collection</h2>
          <p>Carefully hand-woven designs, luxurious fabrics, and stunning borders created for key celebratory occasions.</p>
        </div>

        {/* Filter Navigation Bar */}
        <div className="catalog-filters-bar">
          {/* Categories select pills */}
          <div className="categories-pill-list">
            {[
              { id: 'all', label: 'All Silhouettes' },
              { id: 'sarees', label: 'Royal Sarees' },
              { id: 'lehengas', label: 'Festive Lehengas' },
              { id: 'gowns', label: 'Designer Gowns' },
              { id: 'kurtis', label: 'Salwars & Kurtis' },
              { id: 'accessories', label: 'Accessories' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`category-pill-btn ${selectedCategory === cat.id ? 'active-pill' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search and Sorter */}
          <div className="search-sort-controls">
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-field"
              />
            </div>

            <div className="sort-select-wrapper">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-dropdown"
                aria-label="Sort products"
              >
                <option value="default">Sort: Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown size={14} className="sort-chevron" />
            </div>
          </div>
        </div>

        {/* Product Count Display */}
        <div className="catalog-results-count">
          Showing <span>{filteredAndSortedProducts.length}</span> luxury pieces of {products.length}
        </div>

        {/* Catalog Grid */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="empty-catalog-results">
            <Compass size={40} className="empty-icon floating-icon" />
            <h3>No garments match your search</h3>
            <p>Try resetting the category filter or looking for standard terms like 'Silk', 'Velvet', or 'Red'.</p>
            <button 
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setSortBy('default'); }} 
              className="btn-primary"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="products-catalog-grid">
            {filteredAndSortedProducts.map((product) => (
              <motion.div
                key={product.id}
                className="product-card-luxury"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5 }}
              >
                <div className="card-image-box" onClick={() => handleOpenModal(product)}>
                  <BespokeImage src={product.image_url} alt={product.name} className="product-image" />
                  
                  {/* Luxury Tag Badge */}
                  {product.tag && (
                    <span className="product-badge-tag">{product.tag}</span>
                  )}

                  {/* Heart Wishlist Trigger */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                    className={`card-wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                    aria-label="Toggle wishlist"
                  >
                    <Heart size={16} className={isInWishlist(product.id) ? 'filled-heart' : ''} />
                  </button>
                  
                  {/* Hover Action Button (Centered) */}
                  <div className="hover-action-overlay">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleOpenModal(product); }} 
                      className="overlay-details-pill-btn"
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                  </div>
                </div>

                <div className="card-details-box">
                  <span className="card-category-lbl">{product.category.toUpperCase()}</span>
                  <h3 className="card-title-lbl" onClick={() => handleOpenModal(product)}>{product.name}</h3>
                  <div className="card-price-lbl">{formatPrice(product.price)}</div>
                  
                  <div className="card-action-bar">
                    <button 
                      onClick={() => handleOpenModal(product)} 
                      className="card-quick-view-btn"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => {
                        addToCart(product, getSizesForCategory(product.category)[0], 1);
                        // Trigger simple alert notification
                      }}
                      className="card-add-to-cart-btn"
                      aria-label="Add to cart"
                    >
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ==========================================
          SHOP BY COLLECTIONS (Varanchi Collections Grid)
          ========================================== */}
      <section className="shop-by-collections-section">
        <div className="section-header">
          <h2>Shop by Collections</h2>
          <p>Indulge in our carefully curated wardrobe selections</p>
        </div>

        <div className="collections-grid">
          {[
            { title: 'Mega Sale', desc: 'UPTO 30% OFF', img: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=400&auto=format&fit=crop' },
            { title: 'Wedding Collection', desc: 'Exquisite Bridal Couture', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop' },
            { title: 'Festive Collection', desc: 'Celebratory Splendor', img: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&auto=format&fit=crop' },
            { title: 'Summer Collection', desc: 'Breezy & Light Weaves', img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop' }
          ].map((col, idx) => (
            <div 
              key={idx} 
              className="collection-banner-card"
              onClick={() => handleOpenShowcase(col.title)}
            >
              <div className="collection-card-img" style={{ backgroundImage: `url('${col.img}')` }} />
              <div className="collection-card-overlay" />
              <div className="collection-card-content">
                <h3>{col.title}</h3>
                <span className="collection-card-desc">{col.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================
          HOW IT WORKS (WhatsApp Ordering Guide)
          ========================================== */}
      <section id="how-to-order" className="how-it-works-section">
        <div className="section-header">
          <h2>Seamless Booking Process</h2>
          <p>No tedious online logins or card transactions. Connect with our dedicated styling advisors directly on WhatsApp.</p>
        </div>

        <div className="steps-container">
          <div className="step-item-card">
            <span className="step-number">01</span>
            <h3>Select Styles</h3>
            <p>Browse our catalog of 50 luxury pieces, select your sizes (or bespoke Custom Fit), and add them to your selection cart.</p>
          </div>
          
          <div className="step-item-card">
            <span className="step-number">02</span>
            <h3>Review Cart</h3>
            <p>Open the floating shopping drawer on the top right to double check your selected quantities, sizes, and pricing details.</p>
          </div>

          <div className="step-item-card">
            <span className="step-number">03</span>
            <h3>WhatsApp Book</h3>
            <p>Click "Book via WhatsApp". Your browser will automatically generate a clean order summary and redirect to our chat line.</p>
          </div>

          <div className="step-item-card">
            <span className="step-number">04</span>
            <h3>Confirm & Tailor</h3>
            <p>Neenu and our tailoring experts discuss body measurements, customize lengths, finalize shipping, and process payments.</p>
          </div>
        </div>
      </section>

      {/* ==========================================
          DESIGNER BIO / HERITAGE
          ========================================== */}
      <section id="about" className="designer-heritage-section">
        <div className="heritage-grid">
          <div className="heritage-visual">
            <BespokeImage 
              src="https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=800&auto=format&fit=crop" 
              alt="Designer Neenu Ralish at Work" 
              className="heritage-img" 
            />
            <div className="heritage-visual-badge">
              <span className="gold-text">Est. 2021</span>
            </div>
          </div>

          <div className="heritage-narrative">
            <span className="heritage-subtitle">Meet the Creative Director</span>
            <h2>Neenu Ralish</h2>
            <div className="designer-quote">
              "Elegance is not about being noticed, it's about being remembered. Our designs represent classic handloom legacies crafted with modern sophistication."
            </div>
            <p>
              Growing up surrounded by traditional Indian textiles, Neenu Ralish founded **Niara by Neenu** to bring back the magic of hand-guided embroidery and premium silk weaving. The boutique focuses on raw silks, pure organza, rich velvets, and double-ikat patolas.
            </p>
            <p>
              Under Neenu’s direction, our boutique rejects factory-line machinery. Instead, we support hand-loom villages and master embroidery artisans across Varanasi, Gujarat, and Kanchipuram, bringing bespoke luxurious garments right to your doorstep.
            </p>
            <div className="signature-box">
              <span className="signature-text">Neenu Ralish</span>
              <span className="signature-title">Founder, Niara by Neenu</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          VIDEO CALL SHOPPING CTA BANNER (Varanchi Style)
          ========================================== */}
      <section className="video-shopping-banner">
        <div className="video-banner-overlay" />
        <div className="video-banner-content">
          <h2>Bespoke Video Consultation</h2>
          <p>Inspect the weight of drapes, examine zari weaving patterns, and choose customized colors live with Neenu Ralish.</p>
          <button type="button" onClick={() => setIsVideoModalOpen(true)} className="btn-primary schedule-call-btn">
            Schedule Design Video Call
          </button>
        </div>
      </section>

      {/* ==========================================
          OUR HAPPY CUSTOMERS (Portrait Testimonials)
          ========================================== */}
      <section className="happy-customers-section">
        <div className="section-header">
          <h2>Our Happy Customers</h2>
          <p>Patrons across the globe sharing their authentic experience with Niara handlooms</p>
        </div>

        <div className="customers-scroll-container">
          <div className="customers-grid-scroll">
            {[
              { 
                name: 'Ramamani S', 
                loc: 'Bengaluru', 
                img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=300&auto=format&fit=crop',
                rating: 5,
                date: '12th April 2026',
                purchase: 'Mridula Kanjeevaram Saree',
                text: 'The pure mulberry silk feel is unmatched. Neenu and her team matched my daughter\'s blouse measurements perfectly over a video call! Highly recommend their bespoke fitting.'
              },
              { 
                name: 'Yamini', 
                loc: 'Abu Dhabi', 
                img: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=300&auto=format&fit=crop',
                rating: 5,
                date: '2nd May 2026',
                purchase: 'Noor Bridal Lehenga Set',
                text: 'Stunning borders and design. The WhatsApp payment tracking using UTR was completely secure, and express delivery to Abu Dhabi took only 4 days. Absolutely wonderful experience.'
              },
              { 
                name: 'Anitha Andrews', 
                loc: 'Kerala', 
                img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop',
                rating: 5,
                date: '28th March 2026',
                purchase: 'Sanskriti Ivory Chanderi Saree',
                text: 'Extremely lightweight and elegant. The golden zari work shines beautifully. Getting custom fittings without complex login forms made the order process so pleasant.'
              },
              { 
                name: 'Nibedita Borthakur', 
                loc: 'Assam', 
                img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&auto=format&fit=crop',
                rating: 5,
                date: '19th February 2026',
                purchase: 'Avani Chikankari Kurta Set',
                text: 'Authentic Lucknawi Chikankari work with premium georgette fabric. The fit is perfect, and Neenu’s style recommendations over the WhatsApp slot were spot on!'
              },
              { 
                name: 'Merin Joy', 
                loc: 'United States', 
                img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop',
                rating: 5,
                date: '10th May 2026',
                purchase: 'Emerald Sequin Gown',
                text: 'An absolute show-stopper for my reception. The sequins catch the light beautifully, and the trailing back fit was customized precisely to my heel height.'
              }
            ].map((cust, idx) => (
              <div key={idx} className="customer-portrait-card">
                <div className="customer-img-wrapper">
                  <BespokeImage src={cust.img} alt={cust.name} className="customer-img" />
                </div>
                <div className="customer-details">
                  <div className="customer-rating-row">
                    <span className="rating-stars">{'★'.repeat(cust.rating)}</span>
                    <span className="review-date">{cust.date}</span>
                  </div>
                  <h4>{cust.name}</h4>
                  <span className="customer-location">{cust.loc}</span>
                  <div className="review-verified-badge">
                    <Check size={10} className="check-icon" /> Verified Purchase
                  </div>
                  <div className="review-item-tag">Garment: {cust.purchase}</div>
                  <p className="customer-review-text">"{cust.text}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="testimonials-btn-wrapper">
          <button 
            onClick={() => window.open('https://wa.me/919074450441?text=Hello%20Neenu%2C%20I%20would%20like%20to%20see%20more%20customer%20drapes%20and%20testimonials.', '_blank')} 
            className="btn-secondary"
          >
            View All Testimonials
          </button>
        </div>
      </section>

      {/* ==========================================
          BESPOKE INQUIRIES / CONTACT
          ========================================== */}
      <section id="contact" className="contact-inquiries-section">
        <div className="contact-grid-container">
          <div className="contact-left-card">
            <h2>Custom Styling Consultation</h2>
            <p>Looking for a particular custom hue, an altered sleeve length, or bridal customization advice? Speak directly with Neenu.</p>
            
            <div className="contact-bullet-details">
              <div className="bullet-point">
                <strong>Boutique Address:</strong>
                <span>DLF Phase 3, Gurugram, India</span>
              </div>
              <div className="bullet-point">
                <strong>Enquiry Hours:</strong>
                <span>Mon to Sat: 11:00 AM - 7:00 PM (IST)</span>
              </div>
              <div className="bullet-point">
                <strong>Consultation Channels:</strong>
                <span>WhatsApp Video Call & In-Person Trials (Gurugram Studio)</span>
              </div>
            </div>
          </div>

          <div className="contact-right-form">
            <h3>Send Styling Inquiry</h3>
            <form onSubmit={handleContactSubmit}>
              <div className="form-input-group">
                <label htmlFor="client-name">Your Name</label>
                <input 
                  type="text" 
                  id="client-name" 
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Priyal Sen" 
                  required
                />
              </div>

              <div className="form-input-group">
                <label htmlFor="client-mobile">Mobile Number</label>
                <input 
                  type="tel" 
                  id="client-mobile" 
                  value={contactMobile}
                  onChange={(e) => setContactMobile(e.target.value)}
                  placeholder="e.g. +91 98765 43210" 
                  required
                />
              </div>

              <div className="form-input-group">
                <label htmlFor="interest-category">Category of Interest</label>
                <select 
                  id="interest-category" 
                  value={contactInterest}
                  onChange={(e) => setContactInterest(e.target.value)}
                  aria-label="Category of interest"
                >
                  <option value="Sarees">Royal Sarees Collection</option>
                  <option value="Lehengas">Bridal & Festive Lehengas</option>
                  <option value="Gowns">Designer Reception Gowns</option>
                  <option value="Kurtis">Anarkali & Salwar Suits</option>
                  <option value="Bespoke Designs">Other Custom Bespoke Wear</option>
                </select>
              </div>

              <div className="form-input-group">
                <label htmlFor="styling-message">Your Styling Notes / Request</label>
                <textarea 
                  id="styling-message" 
                  rows="4" 
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Tell us about the occasion, color preferences, custom lengths, or sizing queries..."
                  required
                ></textarea>
              </div>

              <button type="submit" className="form-whatsapp-submit-btn">
                <MessageCircle size={18} />
                Send Inquiry to WhatsApp
              </button>
            </form>
          </div>
        </div>
      </section>
      </>
      )}

      {/* ==========================================
          PRODUCT DETAIL QUICK VIEW MODAL
          ========================================== */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            {/* Modal Backdrop */}
            <motion.div 
              className="modal-backdrop-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
            />

            {/* Modal Box */}
            <motion.div 
              className="modal-box-container dark-glass-panel"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            >
              <button 
                onClick={() => setSelectedProduct(null)} 
                className="modal-close-cross-btn"
                aria-label="Close details modal"
              >
                &times;
              </button>

              <div className="modal-inner-grid">
                {/* Visual Half */}
                <div className="modal-visual-half">
                  <BespokeImage src={selectedProduct.image_url} alt={selectedProduct.name} className="modal-primary-image" />
                  {selectedProduct.tag && (
                    <span className="modal-tag-badge">{selectedProduct.tag}</span>
                  )}
                </div>

                {/* Details Half */}
                <div className="modal-details-half">
                  <span className="modal-category-breadcrumb">{selectedProduct.category.toUpperCase()}</span>
                  <h2>{selectedProduct.name}</h2>
                  <div className="modal-price-tag">{formatPrice(selectedProduct.price)}</div>

                  <p className="modal-description-paragraph">{selectedProduct.description}</p>

                  <div className="modal-specs-box">
                    <span className="spec-label">Fabric Material:</span>
                    <span className="spec-val">
                      {selectedProduct.category === 'sarees' ? 'Pure Mulberry Silk & Zari Thread' :
                       selectedProduct.category === 'lehengas' ? 'Premium Raw Silk & Soft Net lining' :
                       selectedProduct.category === 'gowns' ? 'Fluid Silk Satin & French Lace' :
                       selectedProduct.category === 'kurtis' ? 'Organic Cotton Linen & Fine Chanderi' : 'Brass Alloys with Gold Foil & Real Pearls'}
                    </span>
                  </div>

                  {/* Sizing Section */}
                  <div className="modal-sizes-section">
                    <h4>Select Designer Fit</h4>
                    <div className="sizes-options-grid">
                      {getSizesForCategory(selectedProduct.category).map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`size-option-pill ${selectedSize === size ? 'active-size-pill' : ''}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    {selectedSize === 'Custom Fit' && (
                      <p className="custom-fit-subtext">
                        ✨ <em>Neenu's team will contact you for detailed shoulder, chest, waist, and length measurements via WhatsApp after order booking.</em>
                      </p>
                    )}
                  </div>

                  {/* Quantity and Checkout Section */}
                  <div className="modal-quantity-action-row">
                    <div className="modal-qty-selector">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="qty-adjust-btn"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="qty-value-label">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="qty-adjust-btn"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="modal-checkout-buttons">
                      <button 
                        onClick={handleModalAddToCart} 
                        className={`modal-add-to-selection-btn ${addedAnimation ? 'added-success' : ''}`}
                        disabled={addedAnimation}
                      >
                        {addedAnimation ? (
                          <>
                            <Check size={16} />
                            Added!
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={16} />
                            Add to Selection
                          </>
                        )}
                      </button>

                      <button 
                        onClick={() => toggleWishlist(selectedProduct)} 
                        className={`modal-wishlist-btn ${isInWishlist(selectedProduct.id) ? 'active' : ''}`}
                        title={isInWishlist(selectedProduct.id) ? "Remove from trousseau" : "Save to trousseau"}
                      >
                        <Heart size={16} className={isInWishlist(selectedProduct.id) ? 'filled-heart' : ''} />
                        {isInWishlist(selectedProduct.id) ? 'Wishlisted' : 'Save to Trousseau'}
                      </button>

                      <button 
                        onClick={handleDirectWhatsAppBook} 
                        className="modal-direct-whatsapp-btn"
                      >
                        <MessageCircle size={16} />
                        Book via WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ==========================================
          VIDEO CONSULTATION BOOKING MODAL
          ========================================== */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <>
            <motion.div 
              className="modal-backdrop-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsVideoModalOpen(false)}
            />

            <motion.div 
              className="modal-box-container dark-glass-panel video-booking-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              style={{ maxWidth: '520px' }}
            >
              <button 
                onClick={() => setIsVideoModalOpen(false)} 
                className="modal-close-cross-btn"
                aria-label="Close scheduling modal"
              >
                &times;
              </button>

              <div className="video-booking-inner">
                <span className="booking-modal-tag">Bespoke Design Service</span>
                <h2>Schedule Video Consultation</h2>
                <p className="booking-modal-sub">Confirm a dedicated date & time to inspect drapes, custom tailor sleeve lengths, or explore handloom weaves live.</p>

                <form onSubmit={handleVideoConsultationSubmit} className="video-booking-form">
                  <div className="form-input-group">
                    <label htmlFor="video-name">Your Full Name</label>
                    <input 
                      type="text" 
                      id="video-name" 
                      value={videoClientName}
                      onChange={(e) => setVideoClientName(e.target.value)}
                      placeholder="e.g. Priyal Sen" 
                      required
                    />
                  </div>

                  <div className="form-input-group">
                    <label htmlFor="video-mobile">Your Mobile Number</label>
                    <input 
                      type="tel" 
                      id="video-mobile" 
                      value={videoMobile}
                      onChange={(e) => setVideoMobile(e.target.value)}
                      placeholder="e.g. +91 98765 43210" 
                      required
                    />
                  </div>

                  <div className="booking-form-row">
                    <div className="form-input-group">
                      <label htmlFor="video-occ">Styling Occasion</label>
                      <select 
                        id="video-occ" 
                        value={videoOccasion}
                        onChange={(e) => setVideoOccasion(e.target.value)}
                        aria-label="Styling Occasion"
                      >
                        <option value="Wedding Bridal Couture">Wedding Bridal Couture</option>
                        <option value="Festive Saree Selections">Festive Saree Selections</option>
                        <option value="Contemporary Gowns styling">Contemporary Gowns Styling</option>
                        <option value="Bespoke Trousseau Curation">Bespoke Trousseau Curation</option>
                      </select>
                    </div>

                    <div className="form-input-group">
                      <label htmlFor="video-plat">Styling Platform</label>
                      <select 
                        id="video-plat" 
                        value={videoPlatform}
                        onChange={(e) => setVideoPlatform(e.target.value)}
                        aria-label="Styling Platform"
                      >
                        <option value="WhatsApp Video Call">WhatsApp Video Call</option>
                        <option value="Google Meet Room">Google Meet Room</option>
                        <option value="Zoom Video Conference">Zoom Video Conference</option>
                      </select>
                    </div>
                  </div>

                  <div className="booking-form-row">
                    <div className="form-input-group">
                      <label htmlFor="video-slot">Preferred Time Slot</label>
                      <select 
                        id="video-slot" 
                        value={videoSlot}
                        onChange={(e) => setVideoSlot(e.target.value)}
                        aria-label="Preferred Time Slot"
                      >
                        <option value="Morning Slot (11 AM - 1 PM)">Morning Slot (11 AM - 1 PM)</option>
                        <option value="Afternoon Slot (2 PM - 5 PM)">Afternoon Slot (2 PM - 5 PM)</option>
                        <option value="Evening Slot (5 PM - 7 PM)">Evening Slot (5 PM - 7 PM)</option>
                      </select>
                    </div>

                    <div className="form-input-group">
                      <label htmlFor="video-lang">Preferred Language</label>
                      <select 
                        id="video-lang" 
                        value={videoLanguage}
                        onChange={(e) => setVideoLanguage(e.target.value)}
                        aria-label="Preferred Language"
                      >
                        <option value="English">English</option>
                        <option value="Telugu">Telugu</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Tamil">Tamil</option>
                        <option value="Malayalam">Malayalam</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="form-whatsapp-submit-btn confirm-booking-btn">
                    <MessageCircle size={18} />
                    Confirm Appointment on WhatsApp
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer component */}
      <Footer />
    </div>
  );
};

export default Home;
