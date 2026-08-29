import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingBag, Heart, Ruler, Check, MessageSquare, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useWishlist } from '../context/WishlistContext';
import BespokeImage from './BespokeImage';
import './ProductPage.css';

const ProductPage = ({ product, onBack }) => {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState('');
  const [added, setAdded] = useState(false);

  // Fallback to images array or single image
  const images = (product && product.images && product.images.length > 0)
    ? product.images
    : [product?.image || product?.image_url || '/images/i1.png'];

  const [mainImage, setMainImage] = useState(images[0]);

  useEffect(() => {
    if (product) {
      const initialImages = (product.images && product.images.length > 0)
        ? product.images
        : [product.image || product.image_url || '/images/i1.png'];
      setMainImage(initialImages[0]);
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      } else {
        setSelectedSize('Free Size');
      }
    }
  }, [product]);

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      addToast("Please select a size first.", "info");
      return;
    }

    addToCart(product, selectedSize, 1);
    setAdded(true);
    addToast(`${product.name} (${selectedSize}) added to cart! ✨`, 'success');
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWhatsAppConsult = () => {
    const text = encodeURIComponent(`Hello Sahithi, I am interested in custom styling for: ${product.name} (Code: ${product.id}). Can you help with sizing and customization?`);
    window.open(`https://wa.me/919000164752?text=${text}`, '_blank');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="product-page-container">
      <div className="product-header-nav">
        <button onClick={onBack} className="back-btn-ghost">
          <ArrowLeft size={18} />
          <span>Back to Collection</span>
        </button>
      </div>

      <div className="product-main-grid">
        {/* Image Gallery */}
        <div className="product-gallery">
          <div className="main-image-wrapper">
            <BespokeImage src={mainImage} alt={product.name} className="product-main-image" />
          </div>
          {images.length > 1 && (
            <div className="product-thumbnails">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`thumbnail-btn ${mainImage === img ? 'active' : ''}`}
                  onClick={() => setMainImage(img)}
                  aria-label={`View image ${i + 1}`}
                >
                  <BespokeImage src={img} alt={`Thumbnail ${i + 1}`} className="thumbnail-img" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="product-info-panel">
          <div className="product-badge-row">
            {product.fabric && (
              <span className="product-fabric-badge">{product.fabric}</span>
            )}
            {product.tag && (
              <span className="product-editorial-badge">{product.tag}</span>
            )}
          </div>

          <h1 className="product-title-large">{product.name}</h1>

          <div className="product-price-row">
            <span className="product-price-large">
              {formatPrice(product.sellingPrice || product.price || product.originalPrice)}
            </span>
            {product.discountPercent > 0 && (
              <>
                <span className="product-original-strikethrough">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="product-discount-pill">
                  {product.discountPercent}% OFF
                </span>
              </>
            )}
          </div>

          <div className="product-description-block">
            <p>{product.description || "A luxurious, custom-made haute couture piece by Sahithi Garlapati. Thoughtful detailing and premium fabrics create a timeless silhouette."}</p>
          </div>

          {/* Size Selection */}
          <div className="size-selector-section">
            <div className="size-header">
              <span className="size-label">Select Size / Fit:</span>
              <span className="selected-size-name">{selectedSize}</span>
            </div>
            <div className="size-pills">
              {product.sizes ? product.sizes.map(size => (
                <button
                  key={size}
                  className={`size-pill ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              )) : ['Free Size', 'Custom Size'].map(size => (
                <button
                  key={size}
                  className={`size-pill ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Available Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="colors-section" style={{ marginBottom: '20px' }}>
              <span className="size-label" style={{ display: 'block', marginBottom: '8px' }}>Available Colorways:</span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {product.colors.map(color => (
                  <span key={color} style={{ fontSize: '12px', background: '#f5f2eb', padding: '4px 10px', borderRadius: '20px', border: '1px solid #e0dacf' }}>
                    {color}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="product-actions-sticky">
            <button
              className={`add-to-cart-cta ${added ? 'added' : ''}`}
              onClick={handleAddToCart}
            >
              {added ? <><Check size={20} /> Added to Bag</> : <><ShoppingBag size={20} /> Add to Bag</>}
            </button>

            <button
              className="consult-stylist-btn"
              onClick={handleWhatsAppConsult}
              title="Customise with Designer on WhatsApp"
            >
              <MessageSquare size={18} />
              <span>Customise</span>
            </button>

            <button
              className={`wishlist-toggle-btn ${inWishlist ? 'active' : ''}`}
              onClick={() => {
                toggleWishlist(product);
                addToast(inWishlist ? 'Removed from wishlist' : 'Added to wishlist ❤️', 'info');
              }}
              aria-label="Wishlist toggle"
            >
              <Heart size={20} fill={inWishlist ? 'var(--maroon-red)' : 'none'} color={inWishlist ? 'var(--maroon-red)' : 'currentColor'} />
            </button>
          </div>

          <div className="product-details-accordion">
            <div className="accordion-item">
              <h4>Worldwide Shipping & Delivery</h4>
              <p>Free express delivery across India. International delivery to 10+ countries (USA, UK, UAE, Australia) with tracked packaging.</p>
            </div>
            <div className="accordion-item">
              <h4>Haute Couture Care</h4>
              <p>Dry clean only. Store in a soft muslin garment bag. Protect intricate embroidery and zari work from moisture.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
