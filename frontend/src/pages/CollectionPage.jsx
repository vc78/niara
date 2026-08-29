import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Filter, SlidersHorizontal, Heart, ShoppingBag, Eye, X, Check, Search, RotateCcw, ChevronDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { products, categories } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductGridSkeleton, ProductGridError } from '../components/Skeletons';
import { useToast } from '../context/ToastContext';
import QuickViewModal from '../components/QuickViewModal';
import './CollectionPage.css';

const availableSizes = ['Free Size', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '32', '34', '36', '38', '40', '42', 'Custom'];

const CollectionPage = ({ initialCategory = 'all', onBack, onProductClick }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();

  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState(35000);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sortOption, setSortOption] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mobile filter drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Sync initialCategory prop changes
  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 280);
    return () => clearTimeout(timer);
  }, [activeCategory, sortOption]);

  const handleSizeToggle = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleResetFilters = () => {
    setActiveCategory('all');
    setPriceRange(35000);
    setSelectedSizes([]);
    setSortOption('newest');
    setSearchQuery('');
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (activeCategory !== 'all') count++;
    if (priceRange < 35000) count++;
    if (selectedSizes.length > 0) count += selectedSizes.length;
    if (searchQuery.trim() !== '') count++;
    return count;
  }, [activeCategory, priceRange, selectedSizes, searchQuery]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Category Filter
    if (activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.fabric && p.fabric.toLowerCase().includes(q)) ||
        (p.colors && p.colors.some(c => c.toLowerCase().includes(q))) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Price Filter
    filtered = filtered.filter(p => p.sellingPrice <= priceRange);

    // Size Filter
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(p =>
        p.sizes && p.sizes.some(size => selectedSizes.includes(size))
      );
    }

    // Sorting
    switch (sortOption) {
      case 'price-asc':
        filtered.sort((a, b) => a.sellingPrice - b.sellingPrice);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.sellingPrice - a.sellingPrice);
        break;
      case 'discount':
        filtered.sort((a, b) => b.discountPercent - a.discountPercent);
        break;
      case 'bestseller':
        filtered.sort((a, b) => (b.tag === 'Bestseller' ? 1 : 0) - (a.tag === 'Bestseller' ? 1 : 0));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return filtered;
  }, [activeCategory, priceRange, selectedSizes, sortOption, searchQuery]);

  const activeCategoryObj = categories.find(c => c.id === activeCategory) || { name: 'All Pieces' };

  return (
    <div className="collection-page-wrapper">
      <div className="collection-container">

        {/* Top Header & Breadcrumb Bar */}
        <div className="collection-hero-bar">
          <div className="collection-header-nav">
            <button onClick={onBack} className="back-btn-chic" aria-label="Back to home">
              <ArrowLeft size={17} />
              <span>Back to Home</span>
            </button>
            <div className="collection-breadcrumbs">
              <span onClick={onBack} style={{ cursor: 'pointer' }}>Home</span>
              <span className="crumb-sep">/</span>
              <span>Collections</span>
              <span className="crumb-sep">/</span>
              <span className="crumb-active">{activeCategoryObj.name}</span>
            </div>
          </div>

          <div className="collection-title-row">
            <div className="collection-heading-group">
              <h1 className="collection-main-title">{activeCategoryObj.name}</h1>
              <p className="collection-subtitle">
                Exclusive handcrafted ensembles styled by Sahithi Garlapati
              </p>
            </div>
            <div className="collection-search-bar">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search outfits, fabrics, colors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="collection-search-input"
                aria-label="Search collection"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="search-clear-btn" aria-label="Clear search">
                  <X size={15} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Horizontal Category Pill Scroller (Quick navigation chips) */}
        <div className="category-pill-strip">
          <div className="pill-scroll-track">
            {categories.map(cat => {
              const count = cat.id === 'all'
                ? products.length
                : products.filter(p => p.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  className={`pill-btn ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <span>{cat.name}</span>
                  <span className="pill-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Control Bar (Filter trigger & Sort) */}
        <div className="mobile-filter-toolbar">
          <button
            className="mobile-filter-trigger-btn"
            onClick={() => setIsMobileFilterOpen(true)}
          >
            <SlidersHorizontal size={17} />
            <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
          </button>

          <div className="mobile-sort-wrapper">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="mobile-sort-select"
              aria-label="Sort collection"
            >
              <option value="newest">✨ New Arrivals</option>
              <option value="bestseller">⭐ Bestsellers</option>
              <option value="price-asc">💵 Price: Low to High</option>
              <option value="price-desc">💎 Price: High to Low</option>
              <option value="discount">🏷️ Highest Discount</option>
            </select>
            <ChevronDown size={14} className="sort-chevron-icon" />
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="collection-layout-grid">

          {/* Desktop Filter Sidebar */}
          <aside className="collection-desktop-sidebar">
            <div className="sidebar-header">
              <h3>Filters</h3>
              {activeFiltersCount > 0 && (
                <button onClick={handleResetFilters} className="reset-filters-btn">
                  <RotateCcw size={13} /> Reset
                </button>
              )}
            </div>

            <div className="filter-block">
              <h4 className="filter-heading">Categories</h4>
              <ul className="desktop-category-list">
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button
                      className={`desktop-cat-link ${activeCategory === cat.id ? 'active' : ''}`}
                      onClick={() => setActiveCategory(cat.id)}
                    >
                      <span>{cat.name}</span>
                      <span className="cat-count">
                        {cat.id === 'all'
                          ? products.length
                          : products.filter(p => p.category === cat.id).length}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="filter-block">
              <div className="filter-heading-flex">
                <h4 className="filter-heading">Max Price</h4>
                <span className="price-tag-value">₹{priceRange.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="35000"
                step="1000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="luxury-range-slider"
                aria-label="Price range filter"
              />
              <div className="slider-limits">
                <span>₹5,000</span>
                <span>₹35,000</span>
              </div>
            </div>

            <div className="filter-block">
              <h4 className="filter-heading">Sizes</h4>
              <div className="desktop-size-grid">
                {availableSizes.map(size => (
                  <button
                    key={size}
                    className={`desktop-size-chip ${selectedSizes.includes(size) ? 'active' : ''}`}
                    onClick={() => handleSizeToggle(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-block">
              <h4 className="filter-heading">Sort By</h4>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="desktop-sort-dropdown"
                aria-label="Sort options"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="bestseller">Bestsellers First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="discount">Highest Discount</option>
              </select>
            </div>

            <div className="sidebar-promo-card">
              <Sparkles size={20} className="promo-card-icon" />
              <h5>Custom Styling</h5>
              <p>Need bespoke sizing or bridal consultation? Connect directly with Sahithi on WhatsApp.</p>
              <a
                href="https://wa.me/919000164752?text=Hello%20Sahithi%2C%20I%20would%20like%20to%20consult%20about%20a%20bespoke%20order."
                target="_blank"
                rel="noreferrer"
                className="promo-card-link"
              >
                Chat on WhatsApp
              </a>
            </div>
          </aside>

          {/* Product Gallery Section */}
          <main className="collection-products-area">

            {/* Desktop Toolbar Info */}
            <div className="desktop-results-toolbar">
              <div className="toolbar-count-row">
                <p className="results-count-text">
                  Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'piece' : 'pieces'}
                  {activeCategory !== 'all' && ` in ${activeCategoryObj.name}`}
                </p>
              </div>

              {activeFiltersCount > 0 && (
                <div className="active-filter-chips">
                  {activeCategory !== 'all' && (
                    <span className="filter-chip">
                      {activeCategoryObj.name}
                      <button onClick={() => setActiveCategory('all')} aria-label="Clear category"><X size={12} /></button>
                    </span>
                  )}
                  {priceRange < 35000 && (
                    <span className="filter-chip">
                      ≤ ₹{priceRange.toLocaleString('en-IN')}
                      <button onClick={() => setPriceRange(35000)} aria-label="Clear price limit"><X size={12} /></button>
                    </span>
                  )}
                  {selectedSizes.map(s => (
                    <span key={s} className="filter-chip">
                      Size: {s}
                      <button onClick={() => handleSizeToggle(s)} aria-label={`Clear size ${s}`}><X size={12} /></button>
                    </span>
                  ))}
                  {searchQuery && (
                    <span className="filter-chip">
                      "{searchQuery}"
                      <button onClick={() => setSearchQuery('')} aria-label="Clear search"><X size={12} /></button>
                    </span>
                  )}
                  <button onClick={handleResetFilters} className="clear-all-chips">
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Product Cards Grid */}
            {isLoading ? (
              <ProductGridSkeleton count={6} />
            ) : hasError ? (
              <ProductGridError onRetry={() => setIsLoading(true)} />
            ) : filteredProducts.length === 0 ? (
              <div className="no-products-found">
                <div className="no-products-icon-box">
                  <Filter size={36} />
                </div>
                <h3>No Outfits Found</h3>
                <p>We couldn't find any piece matching your active filters. Try clearing your filters or exploring another category.</p>
                <button onClick={handleResetFilters} className="reset-btn-pill">
                  <RotateCcw size={16} /> Reset All Filters
                </button>
              </div>
            ) : (
              <div className="luxury-product-grid">
                {filteredProducts.map(product => {
                  const inWishlist = isInWishlist(product.id);
                  return (
                    <motion.div
                      key={product.id}
                      className="boutique-product-card"
                      onClick={() => onProductClick && onProductClick(product)}
                      layout
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="card-media-wrapper">
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          className="product-card-img"
                        />

                        {/* Top Badges */}
                        <div className="badge-corner-left">
                          {product.discountPercent > 0 && (
                            <span className="gold-discount-tag">
                              {product.discountPercent}% OFF
                            </span>
                          )}
                        </div>

                        <div className="badge-corner-right">
                          {(product.tag || product.isNew) && (
                            <span className="editorial-tag">
                              {product.tag || 'New'}
                            </span>
                          )}
                        </div>

                        {/* Floating Wishlist Button */}
                        <button
                          className={`wishlist-floating-btn ${inWishlist ? 'active' : ''}`}
                          aria-label="Add to Wishlist"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product);
                            addToast(
                              inWishlist
                                ? `Removed ${product.name} from wishlist`
                                : `Added ${product.name} to wishlist ❤️`,
                              'info'
                            );
                          }}
                        >
                          <Heart
                            size={18}
                            fill={inWishlist ? 'var(--maroon-red)' : 'none'}
                            color={inWishlist ? 'var(--maroon-red)' : 'var(--primary-color)'}
                          />
                        </button>

                        {/* Hover / Quick Action Bar */}
                        <div className="hover-action-overlay">
                          <button
                            className="quick-view-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setQuickViewProduct(product);
                              setIsQuickViewOpen(true);
                            }}
                          >
                            <Eye size={14} />
                            <span>Quick View</span>
                          </button>
                          <button
                            className="quick-add-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product, product.sizes?.[0] || 'Free Size', 1);
                              addToast(`${product.name} added to cart! ✨`, 'success');
                            }}
                          >
                            <ShoppingBag size={14} />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>

                      <div className="product-details-box">
                        <span className="fabric-subtitle">
                          {product.fabric || 'Pure Artisan Silk'}
                        </span>
                        <h3 className="product-item-title">{product.name}</h3>

                        <div className="pricing-row">
                          <span className="final-price">
                            ₹{product.sellingPrice.toLocaleString('en-IN')}
                          </span>
                          {product.discountPercent > 0 && (
                            <span className="strikethrough-price">
                              ₹{product.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>

                        {product.sizes && product.sizes.length > 0 && (
                          <div className="size-preview-row">
                            {product.sizes.slice(0, 3).map((sz, idx) => (
                              <span key={idx} className="size-badge-mini">{sz}</span>
                            ))}
                            {product.sizes.length > 3 && (
                              <span className="size-more">+{product.sizes.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Slide-Up Filter Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="mobile-filter-drawer-backdrop" onClick={() => setIsMobileFilterOpen(false)}>
            <motion.div
              className="mobile-filter-drawer-panel"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
            >
              <div className="drawer-header-bar">
                <div className="drawer-title-group">
                  <h3>Filters & Sorting</h3>
                  <span className="drawer-count">{filteredProducts.length} pieces match</span>
                </div>
                <button
                  className="drawer-close-btn"
                  onClick={() => setIsMobileFilterOpen(false)}
                  aria-label="Close filter drawer"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="drawer-scrollable-body">
                {/* Category Selection */}
                <div className="drawer-section">
                  <h4>Category</h4>
                  <div className="drawer-category-grid">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        className={`drawer-cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat.id)}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="drawer-section">
                  <div className="filter-heading-flex">
                    <h4>Max Price</h4>
                    <span className="price-tag-value">₹{priceRange.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="35000"
                    step="1000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="luxury-range-slider"
                  />
                  <div className="slider-limits">
                    <span>₹5,000</span>
                    <span>₹35,000</span>
                  </div>
                </div>

                {/* Size Selection */}
                <div className="drawer-section">
                  <h4>Sizes</h4>
                  <div className="drawer-size-wrap">
                    {availableSizes.map(size => (
                      <button
                        key={size}
                        className={`drawer-size-btn ${selectedSizes.includes(size) ? 'active' : ''}`}
                        onClick={() => handleSizeToggle(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Option */}
                <div className="drawer-section">
                  <h4>Sort Outfits</h4>
                  <div className="drawer-sort-options">
                    {[
                      { id: 'newest', label: 'Newest Arrivals' },
                      { id: 'bestseller', label: 'Bestsellers' },
                      { id: 'price-asc', label: 'Price: Low to High' },
                      { id: 'price-desc', label: 'Price: High to Low' },
                      { id: 'discount', label: 'Highest Discount' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        className={`drawer-sort-btn ${sortOption === opt.id ? 'active' : ''}`}
                        onClick={() => setSortOption(opt.id)}
                      >
                        <span>{opt.label}</span>
                        {sortOption === opt.id && <Check size={16} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="drawer-footer-actions">
                <button
                  className="drawer-reset-btn"
                  onClick={handleResetFilters}
                >
                  Reset All
                </button>
                <button
                  className="drawer-apply-btn"
                  onClick={() => setIsMobileFilterOpen(false)}
                >
                  Apply ({filteredProducts.length})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick View Modal */}
      <QuickViewModal
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        product={quickViewProduct}
        onNavigateToProduct={onProductClick}
      />
    </div>
  );
};

export default CollectionPage;
