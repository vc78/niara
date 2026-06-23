import React from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './HotPicksDrawer.css';

const HotPicksDrawer = ({ isOpen, onClose, onCartOpen }) => {
  const { addToCart } = useCart();

  const hotPicks = [
    { id: 'hot-1', name: 'Silk Embroidered Kurta', price: 4500, sellingPrice: 4500, tag: 'Hot Pick', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400' },
    { id: 'hot-2', name: 'Designer Lehenga Set', price: 12000, sellingPrice: 12000, tag: 'Limited Stock', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400' },
    { id: 'hot-3', name: 'Chanderi Saree', price: 8500, sellingPrice: 8500, tag: 'New Arrival', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400' }
  ];

  const handleAddToCart = (product) => {
    addToCart(product, "Free Size", 1);
    onClose();
    if (onCartOpen) onCartOpen();
  };

  return (
    <>
      <div className={`hot-picks-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`hot-picks-drawer ${isOpen ? 'open' : ''}`}>
        <div className="hot-picks-header">
          <h2>Hot Picks</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>
        <div className="hot-picks-content">
          {hotPicks.map(product => (
            <div key={product.id} className="hot-pick-card">
              <div className="hot-pick-image">
                <img src={product.image} alt={product.name} />
                <span className="hot-pick-tag">{product.tag}</span>
              </div>
              <div className="hot-pick-info">
                <h3>{product.name}</h3>
                <p>₹{product.price.toLocaleString()}</p>
                <button className="hot-pick-add-btn" onClick={() => handleAddToCart(product)}>
                  <ShoppingBag size={16} /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HotPicksDrawer;
