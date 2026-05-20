import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowLeft, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BespokeImage from './BespokeImage';
import culturalFooterPattern from '../assets/cultural_footer_pattern.png';
import './CartDrawer.css';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    pincode: '',
    notes: '',
    transactionId: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);

  // Pre-fill form when user changes or modal opens
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        mobile: user.mobile || '',
        address: user.address || '',
        pincode: user.pincode || ''
      }));
    }
  }, [user, isOpen]);

  // Reset checkout and invoice state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setIsCheckingOut(false);
        setInvoiceData(null);
      }, 300);
    }
  }, [isOpen]);

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

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

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleContinueShopping = () => {
    clearCart();
    setInvoiceData(null);
    setIsCheckingOut(false);
    onClose();
  };

  const handleWhatsAppCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const phoneNumber = "919074450441"; // Owner's WhatsApp number
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const formattedDate = `${dd}-${mm}-${yyyy}`;

    const generatedInvoiceId = `INV-${yyyy}-${Math.floor(100 + Math.random() * 900)}`;
    
    let orderText = `✨ *New Booking Order - Niara by Neenu* ✨\n\n`;
    orderText += `Hello Neenu, I would like to book the following custom designer items:\n\n`;
    orderText += `🧾 *INVOICE ID:* *${generatedInvoiceId}*\n`;
    orderText += `🛍️ *ORDER DETAILS:*\n`;
    orderText += `------------------------------------------\n`;
    
    cart.forEach((item, index) => {
      orderText += `${index + 1}️⃣ *${item.name}*\n`;
      orderText += `   • Size: *${item.size}*\n`;
      orderText += `   • Qty: *${item.quantity}*\n`;
      orderText += `   • Price: *${formatPrice(item.price)}*\n\n`;
    });
    
    orderText += `------------------------------------------\n`;
    orderText += `💰 *Total Estimated Value:* *${formatPrice(totalAmount)}*\n\n`;
    orderText += `📝 *MY SHIPPING DETAILS:*\n`;
    orderText += `• Name: ${formData.name}\n`;
    orderText += `• Phone: ${formData.mobile}\n`;
    orderText += `• Delivery Address: ${formData.address}\n`;
    orderText += `• Pincode: ${formData.pincode}\n`;
    if (formData.notes) {
      orderText += `• Notes: ${formData.notes}\n`;
    }

    orderText += `💳 *PREFERRED PAYMENT METHOD:* ${
      paymentMethod === 'upi' ? 'Google Pay / UPI' : 
      paymentMethod === 'bank' ? 'Direct Bank Transfer' : 'WhatsApp Pay (In-Chat)'
    }\n`;

    if (paymentMethod === 'upi') {
      orderText += `   • Payee UPI ID: *neenu.niara@oksbi*\n`;
      if (formData.transactionId) {
        orderText += `   • Transaction UTR / Ref No: *${formData.transactionId}*\n`;
      }
    } else if (paymentMethod === 'bank') {
      orderText += `   • Bank Details: *HDFC Bank - A/C 50200084321094 - IFSC HDFC0000102*\n`;
      if (formData.transactionId) {
        orderText += `   • Bank Reference Ref No: *${formData.transactionId}*\n`;
      }
    }

    // Append bespoke measurements if "Custom Fit" is requested
    const requiresCustomFit = cart.some(item => item.size === 'Custom Fit');
    if (requiresCustomFit && user && user.measurements) {
      const { shoulder, bust, waist, hips, height } = user.measurements;
      if (shoulder || bust || waist || hips || height) {
        orderText += `\n📐 *MY SAVED MEASUREMENTS:*\n`;
        if (shoulder) orderText += `   • Shoulder: ${shoulder} in\n`;
        if (bust) orderText += `   • Bust: ${bust} in\n`;
        if (waist) orderText += `   • Waist: ${waist} in\n`;
        if (hips) orderText += `   • Hips: ${hips} in\n`;
        if (height) orderText += `   • Height: ${height}\n`;
      }
    }

    orderText += `\nPlease let me know if these pieces are available and confirm the tailoring slots. I will share the payment screenshot once confirmed. Thank you!`;

    const encodedText = encodeURIComponent(orderText);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
    const mailtoUrl = `mailto:venkatbodduluri78@gmail.com?subject=${encodeURIComponent(`New Booking Order ${generatedInvoiceId} - Niara by Neenu`)}&body=${encodeURIComponent(orderText)}`;
    
    // Open WhatsApp checkout in a new window/tab
    window.open(whatsappUrl, '_blank');
    
    // Open Mail client after a short delay
    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 600);
    
    // Capture invoice details to show success receipt screen
    const generatedInvoice = {
      invoiceId: generatedInvoiceId,
      date: formattedDate,
      clientName: formData.name,
      clientMobile: formData.mobile,
      clientAddress: formData.address,
      clientPincode: formData.pincode,
      notes: formData.notes,
      items: cart.map(item => ({ ...item })),
      total: totalAmount,
      paymentMethod: paymentMethod === 'upi' ? 'UPI' : 
                     paymentMethod === 'bank' ? 'Bank Transfer' : 'Cash',
      transactionId: formData.transactionId || 'Pending Verification'
    };
    
    setInvoiceData(generatedInvoice);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            className="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            className="cart-drawer dark-glass-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="cart-header">
              {invoiceData ? (
                <div className="cart-title-wrapper">
                  <Check size={22} className="gold-icon animate-pulse-slow" />
                  <h3>Order Confirmed</h3>
                </div>
              ) : isCheckingOut ? (
                <div className="cart-title-wrapper">
                  <button onClick={() => setIsCheckingOut(false)} className="back-btn" aria-label="Back to cart">
                    <ArrowLeft size={20} />
                  </button>
                  <h3>Delivery Details</h3>
                </div>
              ) : (
                <div className="cart-title-wrapper">
                  <ShoppingBag size={22} className="gold-icon" />
                  <h3>Your Selection ({totalItems})</h3>
                </div>
              )}
              <button 
                onClick={() => {
                  if (invoiceData) {
                    handleContinueShopping();
                  } else {
                    onClose();
                  }
                }} 
                className="close-btn" 
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            <div className="cart-body">
              {invoiceData ? (
                <div className="invoice-success-container">
                  <div className="success-banner">
                    <div className="success-icon-wrapper animate-bounce-slow">
                      <Check size={36} />
                    </div>
                    <h4>Receipt Compiled</h4>
                    <p className="success-desc">
                      Your booking request has been sent to Neenu via WhatsApp. Please download your luxury invoice below for your records.
                    </p>
                  </div>

                  <div className="receipt-preview-card animate-fade-in">
                    <div className="receipt-header-row">
                      <span className="brand-logo">NIARA BY NEENU</span>
                      <span className="receipt-tag">Bespoke Fitting Receipt</span>
                    </div>
                    
                    <div className="receipt-meta-grid">
                      <div>
                        <span className="label">Invoice No:</span>
                        <span className="val">{invoiceData.invoiceId}</span>
                      </div>
                      <div>
                        <span className="label">Date:</span>
                        <span className="val">{invoiceData.date}</span>
                      </div>
                    </div>

                    <div className="receipt-section-block">
                      <h5>Client & Shipping Details</h5>
                      <p className="highlight-client"><strong>{invoiceData.clientName}</strong></p>
                      <p>{invoiceData.clientMobile}</p>
                      <p className="receipt-address-text">{invoiceData.clientAddress}, {invoiceData.clientPincode}</p>
                    </div>

                    <div className="receipt-section-block">
                      <h5>Payment Status</h5>
                      <p>Method: <strong>{invoiceData.paymentMethod}</strong></p>
                      <p>Ref ID: <code>{invoiceData.transactionId}</code></p>
                    </div>

                    <div className="receipt-summary-block">
                      <h5>Itemized Summary</h5>
                      {invoiceData.items.map((item) => (
                        <div key={`${item.product_id}-${item.size}`} className="receipt-summary-row">
                          <span className="item-name-qty">{item.name} ({item.size}) x{item.quantity}</span>
                          <span className="item-price-val">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                      <div className="receipt-total-row">
                        <span>Grand Total</span>
                        <span className="grand-total-val">{formatPrice(invoiceData.total)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="invoice-action-buttons">
                    <button onClick={handlePrintInvoice} className="btn-primary print-invoice-btn">
                      Download PDF Invoice
                    </button>
                    <button onClick={handleContinueShopping} className="btn-secondary continue-shopping-btn">
                      Continue Shopping
                    </button>
                  </div>
                </div>
              ) : cart.length === 0 ? (
                <div className="empty-cart-state">
                  <ShoppingBag size={48} className="empty-bag-icon floating-icon" />
                  <p className="empty-title">Your selection is empty</p>
                  <p className="empty-subtitle">Explore our luxurious handcrafted collection and add items to your bespoke booking list.</p>
                  <button onClick={onClose} className="btn-secondary shop-btn">Return to Gallery</button>
                </div>
              ) : isCheckingOut ? (
                <form id="checkout-form" className="checkout-form" onSubmit={handleWhatsAppCheckout}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Mobile Number</label>
                    <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Delivery Address</label>
                    <textarea name="address" value={formData.address} onChange={handleInputChange} required rows="3"></textarea>
                  </div>
                  <div className="form-group">
                    <label>Pincode / ZIP</label>
                    <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Tailoring Notes / Preferred Date (Optional)</label>
                    <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows="2"></textarea>
                  </div>

                  <div className="form-group">
                    <label>Preferred Payment Method</label>
                    <div className="payment-options-grid">
                      <div 
                        className={`payment-option-card ${paymentMethod === 'upi' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('upi')}
                      >
                        <span className="payment-title">GPay / UPI</span>
                        <span className="payment-desc">Scan & Pay</span>
                      </div>
                      
                      <div 
                        className={`payment-option-card ${paymentMethod === 'bank' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('bank')}
                      >
                        <span className="payment-title">Bank Transfer</span>
                        <span className="payment-desc">IMPS/NEFT</span>
                      </div>

                      <div 
                        className={`payment-option-card ${paymentMethod === 'whatsapp' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('whatsapp')}
                      >
                        <span className="payment-title">WhatsApp Pay</span>
                        <span className="payment-desc">Pay In Chat</span>
                      </div>
                    </div>

                    {paymentMethod === 'upi' && (
                      <div className="payment-details-panel">
                        <div className="upi-info-row">
                          <p><strong>UPI ID:</strong> neenu.niara@oksbi</p>
                          <button 
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText('neenu.niara@oksbi');
                              setCopiedUpi(true);
                              setTimeout(() => setCopiedUpi(false), 2000);
                            }}
                            className="copy-upi-btn"
                          >
                            {copiedUpi ? <Check size={13} /> : <Copy size={13} />}
                            <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        
                        <div className="upi-qr-wrapper">
                          <p className="qr-title">Scan to Pay via UPI</p>
                          <div className="qr-code-box">
                            <img 
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=neenu.niara@oksbi&pn=Niara%20by%20Neenu&am=${totalAmount}&cu=INR`)}`} 
                              alt="UPI QR Code Scanner" 
                              className="upi-qr-image"
                            />
                          </div>
                          <p className="qr-amount">Subtotal Amount: <strong>{formatPrice(totalAmount)}</strong></p>
                        </div>

                        <div className="form-group-sub">
                          <label className="sub-label">Transaction UTR / Ref No (Optional)</label>
                          <input 
                            type="text" 
                            name="transactionId" 
                            value={formData.transactionId} 
                            onChange={handleInputChange} 
                            placeholder="e.g. 12-digit UTR number" 
                            className="ref-id-input"
                          />
                        </div>
                        
                        <p className="payment-note">Or scan & pay using GPay, PhonePe, or Paytm, then send the payment confirmation screenshot on WhatsApp.</p>
                      </div>
                    )}

                    {paymentMethod === 'bank' && (
                      <div className="payment-details-panel">
                        <p><strong>Bank:</strong> HDFC Bank Ltd</p>
                        <p><strong>A/c Name:</strong> NIARA BY NEENU</p>
                        <p><strong>A/c No:</strong> 50200084321094</p>
                        <p><strong>IFSC:</strong> HDFC0000102</p>
                        
                        <div className="form-group-sub" style={{ marginTop: '10px' }}>
                          <label className="sub-label">Payment Transfer Ref No (Optional)</label>
                          <input 
                            type="text" 
                            name="transactionId" 
                            value={formData.transactionId} 
                            onChange={handleInputChange} 
                            placeholder="e.g. IMPS/NEFT Transaction ID" 
                            className="ref-id-input"
                          />
                        </div>
                        
                        <p className="payment-note">Transfer the exact subtotal value and share the reference screenshot on WhatsApp.</p>
                      </div>
                    )}

                    {paymentMethod === 'whatsapp' && (
                      <div className="payment-details-panel">
                        <p><strong>Native WhatsApp Pay:</strong></p>
                        <p className="payment-note">We will send a payment request link directly to your WhatsApp screen inside our chat window.</p>
                      </div>
                    )}
                  </div>
                </form>
              ) : (
                <div className="cart-items-list">
                  {cart.map((item) => (
                    <motion.div 
                      key={`${item.product_id}-${item.size}`} 
                      className="cart-item"
                      layout
                    >
                      <BespokeImage src={item.image_url} alt={item.name} className="cart-item-image" />
                      <div className="cart-item-details">
                        <h4 className="cart-item-name">{item.name}</h4>
                        <div className="cart-item-meta">
                          <span className="cart-item-size">Size: {item.size}</span>
                        </div>
                        <div className="cart-item-price">{formatPrice(item.price * item.quantity)}</div>
                        
                        <div className="cart-item-actions">
                          <div className="qty-control">
                            <button 
                              onClick={() => updateQuantity(item.product_id, item.size, -1)}
                              className="qty-btn"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="qty-num">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.product_id, item.size, 1)}
                              className="qty-btn"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => removeFromCart(item.product_id, item.size)}
                            className="remove-item-btn"
                            aria-label="Remove item"
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

            {cart.length > 0 && !invoiceData && (
              <div className="cart-footer">
                {!isCheckingOut && (
                  <>
                    <div className="total-summary">
                      <span className="total-label">Subtotal Value</span>
                      <span className="total-amount">{formatPrice(totalAmount)}</span>
                    </div>
                    <p className="cart-disclaimer">
                      Tailoring, customization details, and final delivery quotes will be discussed upon booking confirmation.
                    </p>
                  </>
                )}
                
                {isCheckingOut ? (
                  <button type="submit" form="checkout-form" className="whatsapp-checkout-btn">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="whatsapp-icon">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.705 1.457h.006c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Confirm & Send to WhatsApp
                  </button>
                ) : (
                  <button onClick={() => setIsCheckingOut(true)} className="whatsapp-checkout-btn">
                    Proceed to Checkout
                  </button>
                )}
              </div>
            )}

            {/* Hidden printable invoice container */}
            {invoiceData && (
              <div id="printable-invoice-area" className="hidden-print-invoice">
                <div className="print-invoice-wrapper">
                  <h1 className="print-main-title">WhatsApp Business Invoice</h1>
                  <p className="print-date-line">Invoice Date: {invoiceData.date}</p>
                  
                  <div className="print-green-divider"></div>

                  <table className="print-details-table">
                    <tbody>
                      <tr>
                        <td className="detail-header">Business Name:</td>
                        <td>Niara by Neenu</td>
                      </tr>
                      <tr>
                        <td className="detail-header">Customer Name:</td>
                        <td>{invoiceData.clientName}</td>
                      </tr>
                      <tr>
                        <td className="detail-header">Invoice No:</td>
                        <td>{invoiceData.invoiceId}</td>
                      </tr>
                      <tr>
                        <td className="detail-header">Payment Method:</td>
                        <td>{invoiceData.paymentMethod}</td>
                      </tr>
                    </tbody>
                  </table>

                  <table className="print-items-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th className="text-center" style={{ width: '80px' }}>Qty</th>
                        <th className="text-right" style={{ width: '120px' }}>Price</th>
                        <th className="text-right" style={{ width: '120px' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceData.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name} {item.size ? `(${item.size})` : ''}</td>
                          <td className="text-center">{item.quantity}</td>
                          <td className="text-right">{formatPrice(item.price)}</td>
                          <td className="text-right">{formatPrice(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                      <tr className="grand-total-row">
                        <td style={{ border: 'none' }}></td>
                        <td style={{ border: 'none' }}></td>
                        <td className="grand-total-label">Grand Total</td>
                        <td className="grand-total-value text-right">{formatPrice(invoiceData.total)}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="print-invoice-footer-note">
                    <p className="footer-thank-you"><strong>Thank you for your business!</strong></p>
                    <p className="footer-desc-line">This invoice is designed for sharing easily through WhatsApp.</p>
                    <div className="print-cultural-footer-bg">
                      <img src={culturalFooterPattern} alt="Cultural Motif" />
                    </div>
                  </div>

                  {/* Sizing & custom notes if any */}
                  {(invoiceData.notes || (user && user.measurements)) && (
                    <div className="print-bespoke-details" style={{ marginTop: '40px', borderTop: '1px dashed #cccccc', paddingTop: '20px' }}>
                      <h4 style={{ color: '#10b981', fontFamily: 'Arial, sans-serif', fontSize: '14px', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 'bold' }}>Bespoke Fitting & Notes</h4>
                      {invoiceData.notes && <p style={{ fontSize: '13px', fontFamily: 'Arial, sans-serif', color: '#333', margin: '4px 0' }}><strong>Fitting Notes:</strong> {invoiceData.notes}</p>}
                      {user && user.measurements && (
                        <p style={{ fontSize: '13px', fontFamily: 'Arial, sans-serif', color: '#333', margin: '4px 0' }}>
                          <strong>Measurements:</strong> {user.measurements.shoulder && `Shoulder: ${user.measurements.shoulder}in | `}{user.measurements.bust && `Bust: ${user.measurements.bust}in | `}{user.measurements.waist && `Waist: ${user.measurements.waist}in | `}{user.measurements.hips && `Hips: ${user.measurements.hips}in | `}{user.measurements.height && `Height: ${user.measurements.height}`}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
