import React from 'react';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './QuickViewModal.css';

const QuickViewModal = ({ product, isOpen, onClose, onNavigateToProduct, onCartOpen }) => {
  const { addToCart } = useCart();
  const { addToast } = useToast();

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addToCart(product, "Free Size", 1);
    addToast(`${product.name} added to cart!`, 'success');
    if (onCartOpen) onCartOpen();
    onClose();
  };

  const handleFullDetails = () => {
    onClose();
    if (onNavigateToProduct) onNavigateToProduct(product);
  };

  return (
    <div className="quick-view-overlay" onClick={onClose}>
      <div className="quick-view-content" onClick={e => e.stopPropagation()}>
        <button className="quick-view-close" onClick={onClose}>
          <X size={24} />
        </button>
        <div className="quick-view-split">
          <div className="quick-view-image">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="quick-view-details">
            <span className="qv-tag">{product.category.replace('-', ' ')}</span>
            <h2>{product.name}</h2>
            <p className="qv-price">₹{product.sellingPrice.toLocaleString()}</p>
            {product.discountPercent > 0 && (
              <p className="qv-original-price">
                <strike>₹{product.originalPrice.toLocaleString()}</strike> 
                <span className="qv-discount">({product.discountPercent}% OFF)</span>
              </p>
            )}
            
            <p className="qv-description">
              Experience unparalleled luxury with this signature piece. Handcrafted with precision and tailored for elegance.
            </p>

            <div className="qv-actions">
              <button className="qv-btn-primary" onClick={handleAddToCart}>
                <ShoppingBag size={18} /> Add to Cart
              </button>
              <button className="qv-btn-secondary" onClick={handleFullDetails}>
                View Full Details <ArrowRight size={18} />
              </button>
            </div>
            
            <div className="qv-perks">
              <span>✓ Free Shipping</span>
              <span>✓ Custom Tailoring</span>
              <span>✓ 7-Day Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
