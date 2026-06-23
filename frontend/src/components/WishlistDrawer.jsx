import { useState, useEffect } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { X, Heart, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BespokeImage from './BespokeImage';
import './WishlistDrawer.css';

const WishlistDrawer = ({ isOpen, onClose }) => {
  const { wishlist, toggleWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [isConsulting, setIsConsulting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    notes: ''
  });

  // Pre-fill form when user changes or drawer opens
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        mobile: user.mobile || ''
      }));
    }
  }, [user, isOpen]);

  // Reset consulting state when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setIsConsulting(false), 300);
    }
  }, [isOpen]);

  const totalAmount = wishlist.reduce((total, item) => total + item.price, 0);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleMoveToCart = (item) => {
    addToCart(item, "Free Size", 1);
    toggleWishlist(item); // Remove from wishlist after moving to cart
  };

  const handleWhatsAppConsultation = (e) => {
    e.preventDefault();
    if (wishlist.length === 0) return;

    const phoneNumber = "919000164752"; // Owner's WhatsApp number

    let messageText = `✨ *Bespoke Consultation - Eedara* ✨\n\n`;
    messageText += `Hello Eedara team, I have curated a selection of beautiful designs from your gallery and would love to consult with you on their custom crafting:\n\n`;
    messageText += `💖 *MY TROUSSEAU SELECTION:*\n`;
    messageText += `------------------------------------------\n`;

    wishlist.forEach((item, index) => {
      messageText += `${index + 1}️⃣ *${item.name}*\n`;
      messageText += `   • Category: *${item.category}*\n`;
      messageText += `   • Price: *${formatPrice(item.price)}*\n\n`;
    });

    messageText += `------------------------------------------\n`;
    messageText += `💰 *Total Estimated Value:* *${formatPrice(totalAmount)}*\n\n`;
    messageText += `📝 *CLIENT INFORMATION:*\n`;
    messageText += `• Name: ${formData.name}\n`;
    messageText += `• Phone: ${formData.mobile}\n`;
    if (formData.notes) {
      messageText += `• Consultation Notes: ${formData.notes}\n`;
    }

    // Add client measurements if they exist in the logged-in user profile
    if (user && user.measurements) {
      const { shoulder, bust, waist, hips } = user.measurements;
      if (shoulder || bust || waist || hips) {
        messageText += `\n📐 *MY SAVED MEASUREMENTS:*\n`;
        if (shoulder) messageText += `   • Shoulder: ${shoulder} in\n`;
        if (bust) messageText += `   • Bust: ${bust} in\n`;
        if (waist) messageText += `   • Waist: ${waist} in\n`;
        if (hips) messageText += `   • Hips: ${hips} in\n`;
      }
    }

    messageText += `\nPlease let me know your availability for a custom design consultation to discuss fabrics, embellishments, and delivery timelines. Thank you!`;

    const encodedText = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;

    window.open(whatsappUrl, '_blank');

    clearWishlist();
    setIsConsulting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            className="wishlist-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            className="wishlist-drawer dark-glass-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="wishlist-header">
              {isConsulting ? (
                <div className="wishlist-title-wrapper">
                  <button onClick={() => setIsConsulting(false)} className="back-btn" aria-label="Back to wishlist">
                    <ArrowLeft size={20} />
                  </button>
                  <h3>Consultation Details</h3>
                </div>
              ) : (
                <div className="wishlist-title-wrapper">
                  <Heart size={22} className="gold-icon filled-heart" />
                  <h3>My Trousseau ({wishlist.length})</h3>
                </div>
              )}
              <button onClick={onClose} className="close-btn" aria-label="Close wishlist">
                <X size={20} />
              </button>
            </div>

            <div className="wishlist-body">
              {wishlist.length === 0 ? (
                <div className="empty-wishlist-state">
                  <Heart size={48} className="empty-heart-icon floating-icon" />
                  <p className="empty-title">Your Trousseau is Empty</p>
                  <p className="empty-subtitle">Heart your favorite luxury pieces while exploring our galleries to save them in your custom trousseau.</p>
                  <button onClick={onClose} className="btn-secondary shop-btn">Browse Collection</button>
                </div>
              ) : isConsulting ? (
                <form id="consultation-form" className="consultation-form" onSubmit={handleWhatsAppConsultation}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Mobile Number</label>
                    <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Preferred Consultation Topics / Special Requests</label>
                    <textarea name="notes" value={formData.notes} onChange={handleInputChange} placeholder="e.g. Fabric alterations, wedding date, matching outfits..." rows="4"></textarea>
                  </div>

                  {user && user.measurements && (
                    <div className="measurements-preview-box">
                      <h5>📐 Saved Measurement Profile Attached</h5>
                      <p>Your saved measurements (Shoulder, Bust, Waist, Hips) will be attached automatically to help Neenu understand your bespoke fit.</p>
                    </div>
                  )}
                </form>
              ) : (
                <div className="wishlist-items-list">
                  {wishlist.map((item) => (
                    <motion.div
                      key={item.id}
                      className="wishlist-item"
                      layout
                    >
                      <BespokeImage src={item.image_url} alt={item.name} className="wishlist-item-image" />
                      <div className="wishlist-item-details">
                        <h4 className="wishlist-item-name">{item.name}</h4>
                        <div className="wishlist-item-category">{item.category}</div>
                        <div className="wishlist-item-price">{formatPrice(item.price)}</div>

                        <div className="wishlist-item-actions">
                          <button
                            onClick={() => handleMoveToCart(item)}
                            className="move-to-cart-btn btn-secondary-mini"
                          >
                            <ShoppingBag size={14} />
                            Move to Cart
                          </button>

                          <button
                            onClick={() => toggleWishlist(item)}
                            className="remove-wishlist-btn"
                            aria-label="Remove from wishlist"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {wishlist.length > 0 && (
              <div className="wishlist-footer">
                {!isConsulting && (
                  <div className="total-summary">
                    <span className="total-label">Curated Value</span>
                    <span className="total-amount">{formatPrice(totalAmount)}</span>
                  </div>
                )}

                {isConsulting ? (
                  <button type="submit" form="consultation-form" className="whatsapp-consult-btn">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="whatsapp-icon">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.705 1.457h.006c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Send to WhatsApp
                  </button>
                ) : (
                  <button onClick={() => setIsConsulting(true)} className="whatsapp-consult-btn">
                    Consult on WhatsApp
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WishlistDrawer;
