import React, { useState, useMemo } from 'react';
import { ArrowLeft, Filter, Heart, MessageSquare } from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductGridSkeleton, ProductGridError } from '../components/Skeletons';
import './CollectionPage.css';

const CollectionPage = ({ initialCategory = 'all', onBack, onProductClick }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState(20000);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sortOption, setSortOption] = useState('newest');
  
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    // Simulate network delay for fetching products
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  const categories = [
    { id: 'all', name: 'All Pieces' },
    { id: 'kurta-sets', name: 'Kurta Sets' },
    { id: 'co-ords', name: 'Co-ords' },
    { id: 'lehengas', name: 'Lehengas' },
    { id: 'festive-wear', name: 'Festive Wear' }
  ];

  const handleSizeToggle = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }

    filtered = filtered.filter(p => p.sellingPrice <= priceRange);

    if (selectedSizes.length > 0) {
      filtered = filtered.filter(p => p.sizes.some(size => selectedSizes.includes(size)));
    }

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
      case 'newest':
      default:
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return filtered;
  }, [activeCategory, priceRange, selectedSizes, sortOption]);

  const handleWhatsAppOrder = (product) => {
    const message = encodeURIComponent(`Hi Sahithi, I would like to order the ${product.name} (₹${product.sellingPrice}).`);
    window.open(`https://wa.me/919000164752?text=${message}`, '_blank');
  };

  return (
    <div className="collection-page" style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      <div className="collection-container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 5%' }}>
        
        {/* Header & Breadcrumb */}
        <div className="collection-header" style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}>
            <ArrowLeft size={20} /> Back to Home
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', color: 'var(--primary-color)', margin: '0 0 5px' }}>
              {categories.find(c => c.id === activeCategory)?.name || 'Collection'}
            </h1>
            <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
              Home {'>'} Collections {'>'} {categories.find(c => c.id === activeCategory)?.name || 'All'}
            </p>
          </div>
        </div>

        <div className="collection-layout" style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
          
          {/* Sidebar Filters */}
          <aside className="collection-sidebar">
            <div className="filter-group">
              <h4>Categories</h4>
              <ul className="category-list">
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button 
                      className={`cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
                      onClick={() => setActiveCategory(cat.id)}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="filter-group">
              <h4>Price Range: Up to ₹{priceRange.toLocaleString()}</h4>
              <input 
                type="range" 
                min="1000" 
                max="20000" 
                step="500" 
                value={priceRange} 
                onChange={(e) => setPriceRange(Number(e.target.value))} 
                style={{ width: '100%', accentColor: 'var(--primary-color)' }}
              />
            </div>

            <div className="filter-group">
              <h4>Sizes</h4>
              <div className="size-filters">
                {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                  <button 
                    key={size}
                    className={`size-btn ${selectedSizes.includes(size) ? 'active' : ''}`}
                    onClick={() => handleSizeToggle(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4>Sort By</h4>
              <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="sort-select">
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="discount">Highest Discount</option>
              </select>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="collection-main" style={{ flex: 1 }}>
            <p className="product-count" style={{ marginBottom: '20px', fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}>
              Showing {filteredProducts.length} of {products.length} pieces
            </p>

            <div className="products-grid">
              {isLoading ? (
                <ProductGridSkeleton count={6} />
              ) : hasError ? (
                <ProductGridError onRetry={() => setIsLoading(true)} />
              ) : (
                filteredProducts.map(product => (
                  <div key={product.id} className="product-card" onClick={() => onProductClick && onProductClick(product)} style={{ cursor: 'pointer' }}>
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
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                      >
                        <Heart fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                      </button>
                      <button className="whatsapp-btn-overlay" onClick={(e) => {
                        e.stopPropagation();
                        handleWhatsAppOrder(product);
                      }}>
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
              )))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
