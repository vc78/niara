import React, { useState } from 'react';
import { X, MapPin, Phone, Clock, Send, Camera } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import './ContactModal.css';

const ContactModal = ({ isOpen, onClose }) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      addToast("Your message has been sent successfully. We will get back to you shortly.", "success");
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      onClose();
    }, 1500);
  };

  return (
    <div className="contact-modal-overlay" onClick={onClose}>
      <div className="contact-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="contact-close-btn" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="contact-modal-grid">
          {/* Left Column: Contact Form */}
          <div className="contact-form-section">
            <div className="contact-header">
              <h2>Get in Touch</h2>
              <p>For bespoke inquiries, bridal styling, or support, please drop us a message.</p>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Jane Doe" />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+91 00000 00000" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="jane@example.com" />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select id="subject" name="subject" value={formData.subject} onChange={handleChange} required>
                  <option value="" disabled>Select an inquiry type...</option>
                  <option value="Bridal Consultation">Bridal Consultation</option>
                  <option value="Custom Order">Custom Order</option>
                  <option value="Order Status">Order Status</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} required placeholder="How can we assist you today?" rows="4"></textarea>
              </div>

              <button type="submit" className="contact-submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : <><Send size={18} /> Send Message</>}
              </button>
            </form>
          </div>

          {/* Right Column: Store Location & Details */}
          <div className="contact-info-section">
            <div className="contact-info-card">
              <h3>Visit Our Studio</h3>
              <p className="subtitle">Experience luxury in person.</p>
              
              <ul className="info-list">
                <li>
                  <MapPin size={20} className="info-icon" />
                  <div className="info-text">
                    <strong>Flagship Studio</strong>
                    <span>Navya Sri Namburi Label<br/>Hyderabad, India</span>
                  </div>
                </li>
                <li>
                  <Phone size={20} className="info-icon" />
                  <div className="info-text">
                    <strong>Phone / WhatsApp</strong>
                    <span>+91 90001 64752</span>
                  </div>
                </li>
                <li>
                  <Clock size={20} className="info-icon" />
                  <div className="info-text">
                    <strong>Studio Hours</strong>
                    <span>Mon - Sat: 10:30 AM - 8:00 PM<br/>Sun: By Appointment Only</span>
                  </div>
                </li>
              </ul>

              <div className="map-container">
                {/* Fallback visual map. In production, embed the exact Google Maps iframe */}
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121825.86799017686!2d78.36144883499424!3d17.41215312301132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Store Location"
                ></iframe>
              </div>

              <div className="contact-actions">
                <a href="https://share.google/2eXexwWrCqR9lZgRX" target="_blank" rel="noopener noreferrer" className="directions-btn">
                  <MapPin size={18} /> Get Directions
                </a>
                <a href="https://www.instagram.com/label_by_sahithi_nandan/reels/" target="_blank" rel="noopener noreferrer" className="social-btn">
                  <Camera size={18} /> Follow Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
