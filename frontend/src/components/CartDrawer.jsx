import { useState, useEffect, useRef, useMemo } from 'react';
import emailjs from '@emailjs/browser';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowLeft, Copy, Check, MapPin, AlertCircle, QrCode, CreditCard, FileText, Download, Share2, MessageCircle, Tag, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { handleRazorpayPayment, initializeRazorpay } from '../utils/razorpayService';
import { createInvoiceOrder, generateInvoicePdf, downloadInvoicePdf, shareInvoicePdf, openWhatsAppWithOrder } from '../utils/invoiceService';
import './CartDrawer.css';

const BRAND_NAME = 'LABEL by SAHITHI NANDAN';
const WHATSAPP_NUMBER = '919000164752';
const UPI_ID = 'labelbysahithi@upi';
const DELIVERY_CHARGE = 0;

const BANNER_COUPONS = [
  {
    code: 'FESTIVE25',
    title: 'Festive Grand Luxe',
    discount: '25% OFF',
    percent: 25,
    flatDiscount: 0,
    bannerImg: '/banners/b1.png',
    desc: '25% off on our signature festive & couture collection',
    badge: 'Limited Edition'
  },
  {
    code: 'LABEL20',
    title: 'Heritage Label Special',
    discount: '20% OFF',
    percent: 20,
    flatDiscount: 0,
    bannerImg: '/banners/b2.png',
    desc: '20% off across all handcrafted artisanal sets',
    badge: 'Popular'
  },
  {
    code: 'WELCOME15',
    title: 'Welcome Trousseau',
    discount: '15% OFF',
    percent: 15,
    flatDiscount: 0,
    bannerImg: '/banners/b3.png',
    desc: '15% instant discount on your current order',
    badge: 'New User'
  },
  {
    code: 'FREESHIP',
    title: 'Express Ship + ₹500 OFF',
    discount: '₹500 OFF + Free Ship',
    percent: 0,
    flatDiscount: 500,
    bannerImg: '/banners/b4.png',
    desc: 'Free worldwide express delivery plus ₹500 instant off',
    badge: 'Global'
  }
];

const CartDrawer = ({ isOpen, onClose, externalCoupon, onClearExternalCoupon }) => {
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

  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [invoiceError, setInvoiceError] = useState('');
  const invoiceBlobRef = useRef(null);

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [flatDiscountAmount, setFlatDiscountAmount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [activeCouponObj, setActiveCouponObj] = useState(null);

  const executeApplyCoupon = (inputCode) => {
    const code = (inputCode || couponCode).trim().toUpperCase();
    if (!code) {
      setAppliedDiscount(0);
      setFlatDiscountAmount(0);
      setCouponMessage('');
      setActiveCouponObj(null);
      return;
    }

    if (code === 'FESTIVE25' || code === 'ROYAL25') {
      setAppliedDiscount(25);
      setFlatDiscountAmount(0);
      setCouponMessage('🎉 FESTIVE25 Applied! 25% Luxury Discount applied.');
      setCouponCode('FESTIVE25');
      setActiveCouponObj(BANNER_COUPONS[0]);
    } else if (code === 'LABEL20' || code === 'HERITAGE20' || code === 'FESTIVE20') {
      setAppliedDiscount(20);
      setFlatDiscountAmount(0);
      setCouponMessage('🎉 LABEL20 Applied! 20% Heritage Discount applied.');
      setCouponCode('LABEL20');
      setActiveCouponObj(BANNER_COUPONS[1]);
    } else if (code === 'WELCOME15' || code === 'BRIDAL15') {
      setAppliedDiscount(15);
      setFlatDiscountAmount(0);
      setCouponMessage('🎉 WELCOME15 Applied! 15% Welcome Discount applied.');
      setCouponCode('WELCOME15');
      setActiveCouponObj(BANNER_COUPONS[2]);
    } else if (code === 'FREESHIP' || code === 'GLOBALFREE') {
      setAppliedDiscount(0);
      setFlatDiscountAmount(500);
      setCouponMessage('🎉 FREESHIP Applied! ₹500 Flat OFF + Free Express Shipping.');
      setCouponCode('FREESHIP');
      setActiveCouponObj(BANNER_COUPONS[3]);
    } else {
      setAppliedDiscount(0);
      setFlatDiscountAmount(0);
      setCouponMessage('❌ Invalid coupon code. Try one of the available vouchers below.');
      setActiveCouponObj(null);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setAppliedDiscount(0);
    setFlatDiscountAmount(0);
    setCouponMessage('');
    setActiveCouponObj(null);
    if (onClearExternalCoupon) onClearExternalCoupon();
  };

  // Sync externalCoupon passed from banner clicks
  useEffect(() => {
    if (externalCoupon) {
      setCouponCode(externalCoupon);
      executeApplyCoupon(externalCoupon);
    }
  }, [externalCoupon]);

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

  // Lock background scroll when drawer is open on mobile/desktop
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Reset checkout state when modal closes completely
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        if (checkoutStep === 3) clearCart();
        setCheckoutStep(0);
        setLocationStatus('');
        setLocationMessage('');
      }, 300);
    }
  }, [isOpen, checkoutStep, clearCart]);

  const subtotalAmount = cart.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);
  
  const discountAmount = useMemo(() => {
    if (flatDiscountAmount > 0) {
      return Math.min(flatDiscountAmount, subtotalAmount);
    }
    if (appliedDiscount > 0) {
      return Math.floor(subtotalAmount * (appliedDiscount / 100));
    }
    return 0;
  }, [subtotalAmount, appliedDiscount, flatDiscountAmount]);

  const totalAmount = Math.max(0, subtotalAmount - discountAmount + DELIVERY_CHARGE);
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
            const city = addressObj.city || addressObj.town || addressObj.village || addressObj.state_district || '';
            const state = addressObj.state || '';
            const road = addressObj.road || '';
            const suburb = addressObj.suburb || addressObj.neighbourhood || '';
            const fullAddress = [road, suburb].filter(Boolean).join(', ');

            setFormData(prev => ({
              ...prev,
              address: fullAddress || prev.address,
              city: city || prev.city,
              state: state || prev.state,
              pincode: pincode || prev.pincode
            }));

            setLocationStatus('success');
            setLocationMessage('Location detected successfully!');
            setTimeout(() => setLocationStatus(''), 3000);
          } else {
            setLocationStatus('error');
            setLocationMessage('Could not find address details');
          }
        } catch (err) {
          console.error("Location error:", err);
          setLocationStatus('error');
          setLocationMessage('Error fetching address from location');
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocationStatus('error');
        setLocationMessage(error.message || 'Permission denied for location');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const validateDeliveryForm = () => {
    if (!formData.name.trim()) return 'Please enter your name';
    if (!formData.email.trim() || !formData.email.includes('@')) return 'Please enter a valid email address';
    if (!formData.mobile.trim() || formData.mobile.length < 10) return 'Please enter a valid 10-digit mobile number';
    if (!formData.address.trim()) return 'Please enter your delivery address';
    if (!formData.pincode.trim() || formData.pincode.length !== 6) return 'Please enter a valid 6-digit pincode';
    if (!formData.city.trim()) return 'Please enter your city';
    if (!formData.state.trim()) return 'Please enter your state';
    return null;
  };

  const handleDeliverySubmit = (e) => {
    e.preventDefault();
    const error = validateDeliveryForm();
    if (error) {
      alert(error);
      return;
    }
    setCheckoutStep(2);
  };

  const buildCompletedOrder = (methodUsed, paymentStatus = 'PENDING', paymentId = '') => {
    const orderData = createInvoiceOrder({
      customer: {
        ...formData,
        totalAmount
      },
      items: cart,
      cart,
      subtotal: subtotalAmount,
      discount: discountAmount,
      deliveryCharge: DELIVERY_CHARGE,
      total: totalAmount,
      paymentMethod: methodUsed,
      paymentStatus,
      paymentId
    });
    setCompletedOrder(orderData);
    setInvoiceError('');
    invoiceBlobRef.current = null;
    return orderData;
  };

  const getInvoiceBlob = () => {
    if (!completedOrder) return null;
    if (!invoiceBlobRef.current) {
      invoiceBlobRef.current = generateInvoicePdf(completedOrder);
    }
    return invoiceBlobRef.current;
  };

  const handleInvoiceDownload = () => {
    try {
      downloadInvoicePdf(completedOrder, getInvoiceBlob());
      setInvoiceError('');
    } catch {
      setInvoiceError('Unable to download invoice right now. Please try again.');
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

    orderText += `\n*Subtotal:* ${formatPrice(subtotalAmount)}\n`;
    if (discountAmount > 0) orderText += `*Coupon Applied (${couponCode}):* -${formatPrice(discountAmount)}\n`;
    if (DELIVERY_CHARGE > 0) orderText += `*Delivery:* ${formatPrice(DELIVERY_CHARGE)}\n`;
    orderText += `*Payment Method:* ${paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'UPI / Online Payment'}\n`;
    orderText += `*TOTAL TO PAY:* ${formatPrice(totalAmount)}\n`;

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
      .catch((err) => console.error('Failed to send email.', err));

    const completed = buildCompletedOrder(paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'UPI / Online Payment', paymentMethod === 'cod' ? 'PENDING' : 'SUCCESSFUL');
    openWhatsAppWithOrder(completed);
    setCheckoutStep(3);
  };

  const handleRazorpayCheckout = async () => {
    try {
      setIsProcessingPayment(true);

      const isInitialized = await initializeRazorpay();
      if (!isInitialized) {
        throw new Error('Failed to load Razorpay. Please try again.');
      }

      const logoUrl = `${window.location.origin}/logos/logo1.png`;

      const options = {
        amount: totalAmount * 100,
        currency: 'INR',
        name: BRAND_NAME,
        description: `Order for ${totalItems} luxury pieces`,
        image: logoUrl,
        handler: function (response) {
          const completed = buildCompletedOrder('Razorpay', 'PAID');
          completed.paymentId = response.razorpay_payment_id;
          setCompletedOrder(completed);
          setCheckoutStep(3);
          setIsProcessingPayment(false);
          openWhatsAppWithOrder(completed);
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile
        },
        theme: {
          color: '#1B263B'
        },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
          }
        }
      };

      await handleRazorpayPayment(options);
    } catch (error) {
      console.error('Razorpay Error:', error);
      alert(error.message || 'Payment failed. Please try again or choose WhatsApp Checkout.');
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
            className="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="cart-header">
              <div className="cart-header-title">
                {checkoutStep > 0 && checkoutStep < 3 && (
                  <button
                    className="back-btn"
                    onClick={() => setCheckoutStep(prev => prev - 1)}
                    aria-label="Go Back"
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}
                <h3>
                  {checkoutStep === 0 && `Your Bag (${totalItems})`}
                  {checkoutStep === 1 && 'Delivery Details'}
                  {checkoutStep === 2 && 'Select Payment'}
                  {checkoutStep === 3 && 'Order Confirmed!'}
                </h3>
              </div>
              <button onClick={onClose} className="close-btn" aria-label="Close Bag">
                <X size={24} />
              </button>
            </div>

            {/* Body Steps */}
            <div className="cart-body">
              {checkoutStep === 3 ? (
                <div className="success-panel">
                  <div className="success-icon-wrapper">
                    <span style={{ fontSize: '48px' }}>✨</span>
                  </div>
                  <h2 className="success-title">Thank you, {formData.name.split(' ')[0]}!</h2>
                  <p className="success-message">
                    Your bespoke order has been recorded. Our design team will contact you shortly for custom measurements.
                  </p>
                  {completedOrder && (
                    <div className="invoice-download-card">
                      <div className="invoice-download-header">
                        <FileText size={20} color="var(--accent-gold)" />
                        <h4>Order Invoice Ready</h4>
                      </div>
                      <p className="invoice-download-copy">
                        Order #{completedOrder.orderId} • {formatPrice(completedOrder.total)}
                      </p>
                      <div className="invoice-action-buttons">
                        <button type="button" className="download-invoice-btn" onClick={handleInvoiceDownload}>
                          <Download size={17} /> Download PDF
                        </button>
                        <button type="button" className="continue-shopping-btn" onClick={handleInvoiceShareToWhatsApp}>
                          <MessageCircle size={17} /> Share on WhatsApp
                        </button>
                      </div>
                      {invoiceError && <p className="invoice-error" role="alert">{invoiceError}</p>}
                    </div>
                  )}
                  <button onClick={handleContinueShopping} className="btn-secondary shop-btn" style={{ marginTop: '20px' }}>
                    Explore More Collections
                  </button>
                </div>
              ) : checkoutStep === 2 ? (
                <div className="payment-panel">
                  <div className="payment-summary-box">
                    <p className="payment-summary-label">Final Amount to Pay</p>
                    <h2 className="payment-summary-total">{formatPrice(totalAmount)}</h2>
                    {discountAmount > 0 && (
                      <p style={{ color: 'var(--accent-gold)', fontSize: '13px', margin: '4px 0 0 0' }}>
                        Includes {couponCode} discount (-{formatPrice(discountAmount)})
                      </p>
                    )}
                  </div>

                  <h3 className="checkout-title">Payment Method</h3>

                  <div className="payment-methods">
                    <label className={`payment-method-card ${paymentMethod === 'razorpay' ? 'active' : ''}`}>
                      <input type="radio" name="payment" value="razorpay" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} style={{ display: 'none' }} />
                      <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><CreditCard size={18} /> Razorpay (Cards / UPI)</div>
                    </label>
                    <label className={`payment-method-card ${paymentMethod === 'upi' ? 'active' : ''}`}>
                      <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} style={{ display: 'none' }} />
                      <div style={{ fontWeight: 600 }}>UPI Direct QR</div>
                    </label>
                    <label className={`payment-method-card payment-method-card-wide ${paymentMethod === 'cod' ? 'active' : ''}`}>
                      <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} style={{ display: 'none' }} />
                      <div style={{ fontWeight: 600 }}>💵 Cash on Delivery</div>
                    </label>
                  </div>

                  {paymentMethod === 'razorpay' ? (
                    <div className="payment-instruction" style={{ textAlign: 'center', padding: '24px 18px', background: 'rgba(212, 175, 55, 0.08)', borderRadius: '12px' }}>
                      <CreditCard size={32} style={{ margin: '0 auto 12px', color: 'var(--accent-gold)' }} />
                      <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--white)' }}>Secure Payment via <strong>Razorpay</strong></p>
                      <p style={{ marginTop: '8px', color: '#cdd4df', fontSize: '13px' }}>Pay instantly using GPay, PhonePe, Paytm, Debit/Credit Card, or Netbanking.</p>
                      <p style={{ marginTop: '12px', fontSize: '14px', color: 'var(--accent-gold)' }}>Total to pay: <strong>{formatPrice(totalAmount)}</strong></p>
                    </div>
                  ) : paymentMethod === 'upi' ? (
                    <>
                      <div className="upi-qr-card">
                        <p className="qr-title"><QrCode size={18} /> Scan QR with GPay / PhonePe / Paytm</p>
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
                      </div>
                    </>
                  ) : (
                    <div className="payment-instruction">
                      <p style={{ color: '#fff' }}><strong>Cash on Delivery (COD)</strong> selected.</p>
                      <p style={{ marginTop: '6px', color: '#ccc', fontSize: '13px' }}>Our customer executive will confirm your order details and delivery window on WhatsApp.</p>
                    </div>
                  )}
                </div>
              ) : checkoutStep === 1 ? (
                <form id="delivery-form" onSubmit={handleDeliverySubmit} className="checkout-form">
                  <div className="location-action-bar">
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      className="use-location-btn"
                      disabled={locationStatus === 'fetching'}
                    >
                      <MapPin size={16} />
                      <span>{locationStatus === 'fetching' ? 'Detecting Location...' : 'Use Current Location'}</span>
                    </button>
                    {locationMessage && (
                      <div className={`location-status-msg ${locationStatus}`}>
                        {locationStatus === 'error' && <AlertCircle size={14} />}
                        {locationStatus === 'success' && <Check size={14} />}
                        <span>{locationMessage}</span>
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Full Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Ananya Sharma" required />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="ananya@example.com" required />
                    </div>
                    <div className="form-group">
                      <label>WhatsApp Mobile *</label>
                      <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder="10-digit number" required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Delivery Address *</label>
                    <textarea name="address" value={formData.address} onChange={handleInputChange} placeholder="Flat / House No., Building Name, Street" rows="2" required />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Pincode *</label>
                      <input type="text" name="pincode" value={formData.pincode} onChange={handlePincodeChange} placeholder="6 digits" maxLength={6} required />
                    </div>
                    <div className="form-group">
                      <label>City *</label>
                      <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="City" required />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>State *</label>
                      <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="State" required />
                    </div>
                    <div className="form-group">
                      <label>Landmark</label>
                      <input type="text" name="landmark" value={formData.landmark} onChange={handleInputChange} placeholder="Near temple, park..." />
                    </div>
                  </div>
                </form>
              ) : cart.length === 0 ? (
                <div className="empty-cart">
                  <ShoppingBag size={56} strokeWidth={1} />
                  <h3>Your Bag is Empty</h3>
                  <p>Explore our handcrafted ensembles and find your bespoke piece.</p>
                  <button onClick={onClose} className="btn-secondary shop-btn">Explore Collection</button>
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
                        <img src={item.image_url || '/images/i1.png'} alt={item.name} />
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

                  {/* Available Luxury Vouchers Section (b1 - b4 banners) */}
                  <div className="cart-vouchers-section">
                    <div className="vouchers-header">
                      <Tag size={16} color="var(--accent-gold)" />
                      <h4>Available Vouchers & Offers</h4>
                    </div>

                    <div className="vouchers-carousel">
                      {BANNER_COUPONS.map((coupon) => {
                        const isApplied = couponCode === coupon.code;
                        return (
                          <div key={coupon.code} className={`voucher-card-item ${isApplied ? 'applied' : ''}`}>
                            <div className="voucher-card-thumb-wrap">
                              <img src={coupon.bannerImg} alt={coupon.title} className="voucher-card-thumb" />
                              <span className="voucher-discount-pill">{coupon.discount}</span>
                            </div>
                            <div className="voucher-card-left">
                              <div className="voucher-top-row">
                                <span className="voucher-badge">{coupon.badge}</span>
                                <strong className="voucher-code">{coupon.code}</strong>
                              </div>
                              <span className="voucher-desc">{coupon.desc}</span>
                            </div>
                            <button
                              type="button"
                              className={`voucher-apply-btn ${isApplied ? 'applied' : ''}`}
                              onClick={() => {
                                if (isApplied) {
                                  handleRemoveCoupon();
                                } else {
                                  executeApplyCoupon(coupon.code);
                                }
                              }}
                            >
                              {isApplied ? <><CheckCircle2 size={14} /> Applied</> : 'Apply'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Footer Options */}
            {cart.length > 0 && checkoutStep !== 3 && (
              <div className="cart-footer">
                {checkoutStep === 0 && (
                  <>
                    <div className="promo-code-container">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter Promo Code"
                        className="promo-input"
                      />
                      <button
                        type="button"
                        onClick={() => executeApplyCoupon(couponCode)}
                        className="promo-apply-btn"
                      >
                        Apply
                      </button>
                      {activeCouponObj && (
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="promo-remove-btn"
                          title="Remove Coupon"
                          aria-label="Remove Coupon"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>

                    {couponMessage && (
                      <p className="coupon-feedback-msg" style={{ fontSize: '12px', color: discountAmount > 0 ? 'var(--accent-gold)' : '#ff6b6b', margin: '4px 0 8px 0' }}>
                        {couponMessage}
                      </p>
                    )}

                    <div className="total-summary">
                      <span className="total-label">Subtotal</span>
                      <span className="total-amount">{formatPrice(subtotalAmount)}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="total-summary" style={{ color: 'var(--accent-gold)' }}>
                        <span className="total-label">
                          Discount ({couponCode} {appliedDiscount > 0 ? `${appliedDiscount}%` : 'Flat'})
                        </span>
                        <span className="total-amount">-{formatPrice(discountAmount)}</span>
                      </div>
                    )}

                    <div className="total-summary">
                      <span className="total-label">Worldwide Express Shipping</span>
                      <span className="total-amount" style={{ color: '#4ade80' }}>FREE</span>
                    </div>

                    <div className="total-summary total-summary-highlight">
                      <span className="total-label" style={{ fontWeight: '700', fontSize: '15px' }}>Estimated Total</span>
                      <span className="total-amount" style={{ fontWeight: '700', fontSize: '18px', color: 'var(--accent-gold)' }}>{formatPrice(totalAmount)}</span>
                    </div>

                    <button type="button" onClick={() => setCheckoutStep(1)} className="whatsapp-checkout-btn">
                      Proceed to Checkout ({formatPrice(totalAmount)})
                    </button>
                  </>
                )}

                {checkoutStep === 1 && (
                  <button type="submit" form="delivery-form" className="whatsapp-checkout-btn">
                    Continue to Payment ({formatPrice(totalAmount)})
                  </button>
                )}

                {checkoutStep === 2 && (
                  <button
                    type="button"
                    onClick={paymentMethod === 'razorpay' ? handleRazorpayCheckout : handleWhatsAppCheckout}
                    className="whatsapp-checkout-btn success-btn"
                    disabled={isProcessingPayment}
                  >
                    {isProcessingPayment ? '⏳ Initializing Secure Gateway...' : paymentMethod === 'razorpay' ? `💳 Pay ${formatPrice(totalAmount)} with Razorpay` : paymentMethod === 'upi' ? '✅ Confirm & Send Order via WhatsApp' : `✅ Place COD Order (${formatPrice(totalAmount)})`}
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
