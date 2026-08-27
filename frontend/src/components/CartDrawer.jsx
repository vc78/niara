import { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowLeft, Copy, Check, MapPin, AlertCircle, QrCode, CreditCard, FileText, Download, Share2, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { handleRazorpayPayment, initializeRazorpay } from '../utils/razorpayService';
import { createInvoiceOrder, generateInvoicePdf, downloadInvoicePdf, shareInvoicePdf, openWhatsAppWithOrder } from '../utils/invoiceService';
import './CartDrawer.css';

const BRAND_NAME = 'SREE VASTRA';
const WHATSAPP_NUMBER = '919032306961';
const UPI_ID = 'sreevastra@okaxis'; // Placeholder UPI ID
const DELIVERY_CHARGE = 0;

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();

  // 0: Cart, 1: Delivery Details, 2: Payment, 3: Success
  const [checkoutStep, setCheckoutStep] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
    landmark: ''
  });

  const [locationStatus, setLocationStatus] = useState(''); // 'fetching', 'success', 'error'
  const [locationMessage, setLocationMessage] = useState('');

  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [invoiceError, setInvoiceError] = useState('');
  const invoiceBlobRef = useRef(null);

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'FESTIVE20') {
      setAppliedDiscount(20);
      setCouponMessage('🎉 20% OFF applied!');
    } else if (code === 'CHOWDARY20') {
      setAppliedDiscount(20);
      setCouponMessage('🎉 20% OFF applied!');
    } else if (code === 'CHOWDARY15') {
      setAppliedDiscount(15);
      setCouponMessage('✨ 15% OFF applied!');
    } else if (code === '') {
      setAppliedDiscount(0);
      setCouponMessage('');
    } else {
      setAppliedDiscount(0);
      setCouponMessage('Invalid coupon code.');
    }
  };

  // Pre-fill form when user changes or modal opens
  useEffect(() => {
    if (user && checkoutStep === 0) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        address: user.address || '',
        pincode: user.pincode || ''
      }));
    }
  }, [user, isOpen, checkoutStep]);

  // Reset checkout state when modal closes completely
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        if (checkoutStep === 3) clearCart(); // If they closed on success screen, clear cart
        setCheckoutStep(0);
        setLocationStatus('');
        setLocationMessage('');
      }, 300);
    }
  }, [isOpen, checkoutStep, clearCart]);

  const subtotalAmount = cart.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);
  const discountAmount = Math.floor(subtotalAmount * (appliedDiscount / 100));
  const totalAmount = subtotalAmount - discountAmount + DELIVERY_CHARGE;
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

  // Auto-fill City & State from Pincode
  const handlePincodeChange = async (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, pincode: value }));

    if (value.length === 6 && /^\d+$/.test(value)) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${value}`);
        const data = await res.json();
        if (data && data[0] && data[0].Status === "Success") {
          const postOffice = data[0].PostOffice[0];
          setFormData(prev => ({
            ...prev,
            city: postOffice.District,
            state: postOffice.State
          }));
        }
      } catch (err) {
        console.error("Pincode fetch error:", err);
      }
    }
  };

  // Geolocation & Reverse Geocoding
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      setLocationMessage('Geolocation is not supported by your browser');
      return;
    }

    setLocationStatus('fetching');
    setLocationMessage('Detecting location...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();

          if (data && data.address) {
            const addressObj = data.address;
            const pincode = addressObj.postcode || '';
            const city = addressObj.city || addressObj.state_district || addressObj.town || addressObj.county || '';
            const state = addressObj.state || '';

            // Format a clean display name without the overly verbose parts if possible
            const fullAddress = [
              addressObj.road,
              addressObj.suburb,
              addressObj.neighbourhood
            ].filter(Boolean).join(', ');

            setFormData(prev => ({
              ...prev,
              address: fullAddress || data.display_name || '',
              pincode,
              city,
              state
            }));

            setLocationStatus('success');
            setLocationMessage('✅ Location detected');
          } else {
            throw new Error('Unable to resolve address');
          }
        } catch {
          setLocationStatus('error');
          setLocationMessage('Failed to detect location. Please enter manually.');
        }
      },
      () => {
        setLocationStatus('error');
        setLocationMessage('Please enter your address manually or enable location in browser settings');
      }
    );
  };

  const handleDeliverySubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.mobile && formData.address && formData.pincode && formData.city && formData.state) {
      setCheckoutStep(2);
    }
  };

  const buildCompletedOrder = (method, status = 'SUCCESSFUL', paymentId = '') => {
    const order = createInvoiceOrder({
      customer: { ...formData, totalAmount },
      items: cart,
      paymentMethod: method,
      paymentStatus: status,
      paymentId,
      orderId: completedOrder?.orderId
    });
    setCompletedOrder(order);
    invoiceBlobRef.current = null;
    setInvoiceError('');
    return order;
  };

  const getInvoiceBlob = () => {
    if (!completedOrder) throw new Error('Order details are not available.');
    if (!invoiceBlobRef.current) invoiceBlobRef.current = generateInvoicePdf(completedOrder);
    return invoiceBlobRef.current;
  };

  const handleInvoiceDownload = () => {
    try {
      downloadInvoicePdf(completedOrder, getInvoiceBlob());
    } catch {
      setInvoiceError('Your invoice could not be generated. Please try again.');
    }
  };

  const handleInvoiceView = () => {
    try {
      const url = URL.createObjectURL(getInvoiceBlob());
      window.open(url, '_blank', 'noopener,noreferrer');
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch {
      setInvoiceError('Your invoice could not be opened. Please download it instead.');
    }
  };

  const handleInvoiceShare = async () => {
    try {
      const shared = await shareInvoicePdf(completedOrder, getInvoiceBlob());
      if (!shared) setInvoiceError('File sharing is not supported here. Use Download PDF instead.');
    } catch (error) {
      if (error?.name !== 'AbortError') setInvoiceError('Your invoice could not be shared. Please download it instead.');
    }
  };

  const handleInvoiceShareToWhatsApp = async () => {
    try {
      const shared = await shareInvoicePdf(completedOrder, getInvoiceBlob());
      if (!shared) {
        downloadInvoicePdf(completedOrder, getInvoiceBlob());
        openWhatsAppWithOrder(completedOrder);
        setInvoiceError('The PDF was downloaded. Attach it to the WhatsApp message that opened.');
      }
    } catch (error) {
      if (error?.name !== 'AbortError') setInvoiceError('Please download the invoice and attach it in WhatsApp.');
    }
  };

  const handleWhatsAppCheckout = () => {
    let orderText = `*New Order - ${BRAND_NAME}*\n------------------\n`;
    orderText += `Name: ${formData.name}\n`;
    orderText += `Phone: ${formData.mobile}\n`;
    orderText += `Address: ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}\n`;
    orderText += `Landmark: ${formData.landmark || 'N/A'}\n\n`;

    orderText += `*Order Details:*\n`;
    cart.forEach((item) => {
      orderText += `• ${item.name} | Size: ${item.size} | Qty: ${item.quantity} | ${formatPrice(item.price)}\n`;
    });

    orderText += `*Subtotal:* ${formatPrice(subtotalAmount)}\n`;
    if (appliedDiscount > 0) orderText += `*Discount (${couponCode}):* -${formatPrice(discountAmount)}\n`;
    if (DELIVERY_CHARGE > 0) orderText += `*Delivery:* ${formatPrice(DELIVERY_CHARGE)}\n`;
    orderText += `*Payment Method:* ${paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'UPI / Online Payment'}\n`;
    orderText += `\n*TOTAL TO PAY:* ${formatPrice(totalAmount)}\n`;
    orderText += `*Please review your order:*`;

    const encodedText = encodeURIComponent(orderText);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;

    // --- EMAIL JS INTEGRATION ---
    const serviceID = 'service_a8hacno';
    const templateID = 'template_3nvh0mg';
    const publicKey = 'AjI2ifuyP51qtZZMX';

    const emailParams = {
      to_email: formData.email,
      to_name: formData.name,
      order_details: orderText.replace(/\n/g, '<br>'),
      total_amount: totalAmount,
      payment_method: paymentMethod === 'upi' ? 'Online/UPI' : 'Cash on Delivery (COD)'
    };

    emailjs.send(serviceID, templateID, emailParams, publicKey)
      .then((response) => {
        console.log('Email sent successfully!', response.status, response.text);
      })
      .catch((err) => {
        console.error('Failed to send email.', err);
      });

    buildCompletedOrder(paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'UPI / Online Payment', paymentMethod === 'cod' ? 'PENDING' : 'SUCCESSFUL');
    window.open(whatsappUrl, '_blank');
    setCheckoutStep(3);
  };

  const handleRazorpayCheckout = async () => {
    try {
      setIsProcessingPayment(true);

      // Initialize Razorpay script
      const isInitialized = await initializeRazorpay();
      if (!isInitialized) {
        throw new Error('Failed to load Razorpay. Please try again.');
      }

      // Prepare payment options
      const options = {
        amount: Math.round(totalAmount * 100), // Razorpay expects amount in paise
        currency: 'INR',
        description: `Order from ${formData.name}`,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile
        },
        handler: async (response) => {
          const completed = buildCompletedOrder('Razorpay Online', 'PAID / SUCCESSFUL', response.razorpay_payment_id);
          // Payment successful - send order details
          const orderText = `*Razorpay Payment Confirmed*\n\nName: ${completed.customer.name}\nPhone: ${completed.customer.mobile}\nAddress: ${completed.customer.address}, ${completed.customer.city}, ${completed.customer.state} - ${completed.customer.pincode}\nLandmark: ${completed.customer.landmark}\n\n*Order Details:*\n${completed.items.map((item) => `- ${item.name} | Size: ${item.size} | Qty: ${item.quantity} | ${formatPrice(item.unitPrice * item.quantity)}`).join('\n')}\n\n*Subtotal:* ${formatPrice(completed.subtotal)}\n${completed.discount > 0 ? `*Discount:* -${formatPrice(completed.discount)}\n` : ''}*Payment Method:* ${completed.paymentMethod}\n*Payment ID:* ${completed.paymentId}\n\n*TOTAL PAID:* ${formatPrice(completed.total)}`;

          const emailParams = {
            to_email: formData.email,
            to_name: formData.name,
            order_details: orderText.replace(/\n/g, '<br>'),
            total_amount: totalAmount,
            payment_method: 'Razorpay Online',
            payment_id: response.razorpay_payment_id
          };

          const serviceID = 'service_a8hacno';
          const templateID = 'template_3nvh0mg';
          const publicKey = 'AjI2ifuyP51qtZZMX';

          try {
            await emailjs.send(serviceID, templateID, emailParams, publicKey);
          } catch (emailError) {
            console.error('Payment succeeded, but confirmation email failed.', emailError);
          }

          // Send to WhatsApp
          const encodedText = encodeURIComponent(orderText);
          window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`, '_blank');

          setCheckoutStep(3);
          clearCart();
        },
        theme: {
          color: '#D4AF37' // Gold color
        }
      };

      await handleRazorpayPayment(options);
    } catch (error) {
      console.error('Razorpay payment error:', error);
      alert(`Payment Error: ${error.message}. Please try again.`);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleContinueShopping = () => {
    clearCart();
    setCheckoutStep(0);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="cart-drawer dark-glass-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="cart-header">
              <div className="cart-title-wrapper">
                {checkoutStep === 0 && <><ShoppingBag size={22} className="gold-icon" /><h3>Your Selection ({totalItems})</h3></>}
                {checkoutStep === 1 && <><button onClick={() => setCheckoutStep(0)} className="back-btn"><ArrowLeft size={20} /></button><h3>Delivery Details</h3></>}
                {checkoutStep === 2 && <><button onClick={() => setCheckoutStep(1)} className="back-btn"><ArrowLeft size={20} /></button><h3>Secure Payment</h3></>}
                {checkoutStep === 3 && <><Check size={22} className="gold-icon animate-pulse-slow" /><h3>Order Confirmed</h3></>}
              </div>
              <button onClick={onClose} className="close-btn" aria-label="Close cart">
                <X size={20} />
              </button>
            </div>

            {/* Step Indicators */}
            {checkoutStep > 0 && checkoutStep < 3 && (
              <div className="checkout-steps">
                <div className={`step ${checkoutStep >= 1 ? 'active' : ''}`}>1. Details</div>
                <div className="step-separator"></div>
                <div className={`step ${checkoutStep >= 2 ? 'active' : ''}`}>2. Payment</div>
              </div>
            )}

            <div className="cart-body">
              {checkoutStep === 3 ? (
                <div className="empty-cart-state success-state">
                  <div className="success-icon-wrapper animate-bounce-slow">
                    <Check size={48} />
                  </div>
                  <p className="empty-title">🎉 Order Placed!</p>
                  <p className="empty-subtitle">Thank you, {formData.name}. Your order details are ready.</p>
                  {completedOrder && (
                    <div className="invoice-success-summary">
                      <div className="invoice-order-number">Order ID: {completedOrder.orderId}</div>
                      <div className="invoice-payment-status">{completedOrder.paymentStatus}</div>
                      <div className="invoice-total-paid">{formatPrice(completedOrder.total)}</div>
                      <div className="invoice-action-buttons">
                        <button type="button" className="print-invoice-btn" onClick={handleInvoiceView}>
                          <FileText size={17} /> View Invoice
                        </button>
                        <button type="button" className="continue-shopping-btn" onClick={handleInvoiceDownload}>
                          <Download size={17} /> Download PDF
                        </button>
                        <button type="button" className="continue-shopping-btn" onClick={handleInvoiceShare}>
                          <Share2 size={17} /> Share PDF
                        </button>
                        <button type="button" className="continue-shopping-btn" onClick={handleInvoiceShareToWhatsApp}>
                          <MessageCircle size={17} /> Share PDF on WhatsApp
                        </button>
                      </div>
                      {invoiceError && <p className="invoice-error" role="alert">{invoiceError}</p>}
                    </div>
                  )}
                  <div className="delivery-estimate-badge">Estimated Delivery: 3–5 business days</div>
                  <button onClick={handleContinueShopping} className="btn-secondary shop-btn" style={{ marginTop: '20px' }}>Continue Shopping</button>
                </div>
              ) : checkoutStep === 2 ? (
                <div className="payment-panel">
                  <div className="payment-summary-box">
                    <p className="payment-summary-label">Amount to Pay</p>
                    <h2 className="payment-summary-total">{formatPrice(totalAmount)}</h2>
                  </div>

                  <h3 className="checkout-title">Payment Method</h3>

                  <div className="payment-methods">
                    <label className={`payment-method-card ${paymentMethod === 'razorpay' ? 'active' : ''}`}>
                      <input type="radio" name="payment" value="razorpay" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} style={{ display: 'none' }} />
                      <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><CreditCard size={18} /> Razorpay</div>
                    </label>
                    <label className={`payment-method-card ${paymentMethod === 'upi' ? 'active' : ''}`}>
                      <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} style={{ display: 'none' }} />
                      <div style={{ fontWeight: 600 }}>UPI Manual</div>
                    </label>
                    <label className={`payment-method-card payment-method-card-wide ${paymentMethod === 'cod' ? 'active' : ''}`}>
                      <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} style={{ display: 'none' }} />
                      <div style={{ fontWeight: 600 }}>💵 Cash on Delivery</div>
                    </label>
                  </div>

                  {paymentMethod === 'razorpay' ? (
                    <div className="payment-instruction" style={{ textAlign: 'center', padding: '30px 20px', background: 'rgba(212, 175, 55, 0.05)', borderRadius: '12px' }}>
                      <CreditCard size={32} style={{ margin: '0 auto 15px', color: 'var(--accent-gold)' }} />
                      <p style={{ fontSize: '16px', fontWeight: 500, color: '#333' }}>Secure Payment via <strong>Razorpay</strong></p>
                      <p style={{ marginTop: '10px', color: '#666' }}>Click "Pay with Razorpay" to complete your payment securely. You will be able to pay using Credit/Debit Card, UPI, Netbanking, and more.</p>
                      <p style={{ marginTop: '15px', fontSize: '14px', color: '#999' }}>Amount to pay: <strong style={{ color: 'var(--accent-gold)' }}>{formatPrice(totalAmount)}</strong></p>
                    </div>
                  ) : paymentMethod === 'upi' ? (
                    <>
                      <div className="upi-qr-card">
                        <p className="qr-title"><QrCode size={18} /> Scan QR with any UPI App</p>
                        <div className="qr-img-wrapper">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(BRAND_NAME)}&am=${totalAmount}&cu=INR&tn=ClothingOrder`}
                            alt="UPI Payment QR Code"
                          />
                        </div>
                      </div>

                      <div className="upi-details-list">
                        <div className="upi-detail-item">
                          <div className="upi-detail-text">
                            <span className="upi-label">UPI ID</span>
                            <span className="upi-value">{UPI_ID}</span>
                          </div>
                          <button
                            className="upi-copy-btn"
                            onClick={() => {
                              navigator.clipboard.writeText(UPI_ID);
                              setCopiedUpi(true);
                              setTimeout(() => setCopiedUpi(false), 2000);
                            }}
                          >
                            {copiedUpi ? <Check size={16} /> : <Copy size={16} />}
                          </button>
                        </div>

                        <div className="upi-detail-item">
                          <div className="upi-detail-text">
                            <span className="upi-label">Phone Number (GPay/PhonePe)</span>
                            <span className="upi-value">+{WHATSAPP_NUMBER.slice(0, 2)}-{WHATSAPP_NUMBER.slice(2)}</span>
                          </div>
                          <button
                            className="upi-copy-btn"
                            onClick={() => {
                              navigator.clipboard.writeText(WHATSAPP_NUMBER);
                              setCopiedPhone(true);
                              setTimeout(() => setCopiedPhone(false), 2000);
                            }}
                          >
                            {copiedPhone ? <Check size={16} /> : <Copy size={16} />}
                          </button>
                        </div>
                      </div>

                      <div className="payment-instruction">
                        <p>Scan QR or open any UPI app and pay <strong>{formatPrice(totalAmount)}</strong>. After payment, click 'I have paid' below to confirm your order.</p>
                      </div>
                    </>
                  ) : (
                    <div className="payment-instruction" style={{ textAlign: 'center', padding: '30px 20px', background: 'rgba(212, 175, 55, 0.05)', borderRadius: '12px' }}>
                      <p style={{ fontSize: '16px', fontWeight: 500, color: '#333' }}>You have selected <strong>Cash on Delivery</strong>.</p>
                      <p style={{ marginTop: '10px', color: '#666' }}>You will pay <strong>{formatPrice(totalAmount)}</strong> directly to our delivery executive when your order arrives.</p>
                    </div>
                  )}
                </div>
              ) : checkoutStep === 1 ? (
                <form id="delivery-form" className="checkout-form" onSubmit={handleDeliverySubmit}>
                  <button
                    type="button"
                    className="btn-location"
                    onClick={handleUseCurrentLocation}
                    disabled={locationStatus === 'fetching'}
                  >
                    <MapPin size={16} />
                    {locationStatus === 'fetching' ? 'Detecting Location...' : 'Use My Current Location'}
                  </button>

                  {locationMessage && (
                    <div className={`location-status-badge ${locationStatus}`}>
                      {locationStatus === 'error' ? <AlertCircle size={14} /> : null}
                      <span>{locationMessage}</span>
                    </div>
                  )}

                  <div className="form-group">
                    <label>Full Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="For order confirmation" />
                  </div>
                  <div className="form-group">
                    <label>Phone Number (10-digit) *</label>
                    <input type="tel" name="mobile" pattern="[0-9]{10}" title="10-digit mobile number" value={formData.mobile} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Pincode *</label>
                    <input type="text" name="pincode" pattern="[0-9]{6}" title="6-digit pincode" value={formData.pincode} onChange={handlePincodeChange} required />
                  </div>
                  <div className="form-row">
                    <div className="form-group half">
                      <label>City *</label>
                      <input type="text" name="city" value={formData.city} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group half">
                      <label>State *</label>
                      <input type="text" name="state" value={formData.state} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Full Address *</label>
                    <textarea name="address" value={formData.address} onChange={handleInputChange} required rows="2" placeholder="House No, Building, Street Area"></textarea>
                  </div>
                  <div className="form-group">
                    <label>Landmark (Optional)</label>
                    <input type="text" name="landmark" value={formData.landmark} onChange={handleInputChange} placeholder="E.g. Near Apollo Hospital" />
                  </div>
                </form>
              ) : cart.length === 0 ? (
                <div className="empty-cart-state">
                  <ShoppingBag size={48} className="empty-bag-icon floating-icon" />
                  <p className="empty-title">Your cart is empty</p>
                  <p className="empty-subtitle">Explore our luxurious handcrafted collection and add items to your cart.</p>
                  <button onClick={onClose} className="btn-secondary shop-btn">Return to Gallery</button>
                </div>
              ) : (
                <div className="cart-items-list">
                  {cart.map((item) => (
                    <motion.div
                      key={`${item.product_id}-${item.size}`}
                      className="cart-item"
                      layout
                    >
                      <div className="cart-item-image">
                        <img src={item.image_url || 'https://via.placeholder.com/150'} alt={item.name} />
                      </div>
                      <div className="cart-item-details">
                        <h4 className="cart-item-name">{item.name}</h4>
                        <div className="cart-item-meta">
                          <span className="cart-item-size">Size: {item.size}</span>
                        </div>
                        <div className="cart-item-price">{formatPrice((item.price || 0) * item.quantity)}</div>

                        <div className="cart-item-actions">
                          <div className="qty-control">
                            <button onClick={() => updateQuantity(item.product_id, item.size, -1)} className="qty-btn" aria-label="Decrease quantity">
                              <Minus size={12} />
                            </button>
                            <span className="qty-num">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product_id, item.size, 1)} className="qty-btn" aria-label="Increase quantity">
                              <Plus size={12} />
                            </button>
                          </div>

                          <button onClick={() => removeFromCart(item.product_id, item.size)} className="remove-item-btn" aria-label="Remove item">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer Options */}
            {cart.length > 0 && checkoutStep !== 3 && (
              <div className="cart-footer">
                {checkoutStep === 0 && (
                  <>
                    <div className="promo-code-container" style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Promo Code"
                        style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid rgba(250, 248, 244, 0.2)', background: 'transparent', color: 'var(--white)' }}
                      />
                      <button onClick={applyCoupon} style={{ padding: '0 15px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: 'var(--accent-gold)', border: '1px solid var(--accent-gold)', cursor: 'pointer' }}>Apply</button>
                    </div>
                    {couponMessage && (
                      <p style={{ fontSize: '12px', color: appliedDiscount > 0 ? 'var(--accent-gold)' : '#ff6b6b', marginBottom: '15px', marginTop: '-10px' }}>
                        {couponMessage}
                      </p>
                    )}

                    <div className="total-summary" style={{ paddingBottom: appliedDiscount > 0 ? '5px' : '0' }}>
                      <span className="total-label">Subtotal</span>
                      <span className="total-amount">{formatPrice(subtotalAmount)}</span>
                    </div>

                    {appliedDiscount > 0 && (
                      <div className="total-summary" style={{ color: 'var(--accent-gold)', paddingBottom: '5px' }}>
                        <span className="total-label">Discount ({appliedDiscount}%)</span>
                        <span className="total-amount">-{formatPrice(discountAmount)}</span>
                      </div>
                    )}

                    {DELIVERY_CHARGE > 0 && (
                      <div className="total-summary" style={{ paddingBottom: '10px' }}>
                        <span className="total-label">Delivery Fee</span>
                        <span className="total-amount">{formatPrice(DELIVERY_CHARGE)}</span>
                      </div>
                    )}

                    <div className="total-summary" style={{ borderTop: '1px solid rgba(250, 248, 244, 0.1)', paddingTop: '10px' }}>
                      <span className="total-label" style={{ fontWeight: '600' }}>Order Total</span>
                      <span className="total-amount" style={{ fontWeight: '600', color: 'var(--accent-gold)' }}>{formatPrice(totalAmount)}</span>
                    </div>

                    <button onClick={() => setCheckoutStep(1)} className="whatsapp-checkout-btn" style={{ marginTop: '15px' }}>
                      Proceed to Order
                    </button>
                  </>
                )}

                {checkoutStep === 1 && (
                  <button type="submit" form="delivery-form" className="whatsapp-checkout-btn">
                    Continue to Payment
                  </button>
                )}

                {checkoutStep === 2 && (
                  <button
                    onClick={paymentMethod === 'razorpay' ? handleRazorpayCheckout : handleWhatsAppCheckout}
                    className="whatsapp-checkout-btn success-btn"
                    disabled={isProcessingPayment}
                  >
                    {isProcessingPayment ? '⏳ Processing...' : paymentMethod === 'razorpay' ? '💳 Pay with Razorpay' : paymentMethod === 'upi' ? '✅ I Have Paid - Send Order via WhatsApp' : '✅ Place Order (COD) via WhatsApp'}
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

export default CartDrawer;
