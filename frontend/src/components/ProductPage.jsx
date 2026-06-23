import React, { useState } from 'react';
import { ArrowLeft, ShoppingBag, Heart, Ruler, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import BespokeImage from './BespokeImage';
import './ProductPage.css';

const ProductPage = ({ product, onBack }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [added, setAdded] = useState(false);

  if (!product) return null;

  // Make sure product has an array of images or fallback to single image
  const images = product.images || [product.image_url];
  const [mainImage, setMainImage] = useState(images[0]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size first.");
      return;
    }
    
    addToCart(product, selectedSize, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
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
          <ArrowLeft size={20} /> Back to Collection
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
                >
                  <BespokeImage src={img} alt={`Thumbnail ${i}`} className="thumbnail-img" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="product-info-panel">
          <h1 className="product-title-large">{product.name}</h1>
          <p className="product-price-large">{formatPrice(product.sellingPrice || product.price)}</p>
          
          <div className="product-description-block">
            <p>{product.description || "A luxury handcrafted piece by Sahithi Nandhan. Intricate detailing and premium fabrics create a timeless silhouette."}</p>
          </div>

          <div className="size-selector-section">
            <div className="size-header">
              <span className="size-label">Select Size</span>
              <button className="size-guide-btn"><Ruler size={14} /> Size Guide</button>
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
              )) : ['XS', 'S', 'M', 'L', 'XL', 'Custom'].map(size => (
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

          <div className="product-actions-sticky">
            <button 
              className={`add-to-cart-cta ${added ? 'added' : ''}`}
              onClick={handleAddToCart}
            >
              {added ? <><Check size={20} /> Added to Cart</> : <><ShoppingBag size={20} /> Add to Cart</>}
            </button>
          </div>

          <div className="product-details-accordion">
            <div className="accordion-item">
              <h4>Shipping & Delivery</h4>
              <p>Free express delivery across India. Delivery within 3-5 business days. International shipping available.</p>
            </div>
            <div className="accordion-item">
              <h4>Care Instructions</h4>
              <p>Dry clean only. Store in a cool, dry place. Keep away from direct sunlight.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
