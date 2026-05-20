import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Ruler, Sparkles, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './UserProfileModal.css';

const UserProfileModal = ({ isOpen, onClose }) => {
  const { user, updateMeasurements, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState('measurements'); // 'profile' | 'measurements'
  const [isSaved, setIsSaved] = useState(false);
  
  const [formData, setFormData] = useState({
    shoulder: '',
    bust: '',
    waist: '',
    hips: '',
    height: '',
    notes: ''
  });

  // Load existing measurements when modal opens or user changes
  useEffect(() => {
    if (user && user.measurements) {
      setFormData({
        shoulder: user.measurements.shoulder || '',
        bust: user.measurements.bust || '',
        waist: user.measurements.waist || '',
        hips: user.measurements.hips || '',
        height: user.measurements.height || '',
        notes: user.measurements.notes || ''
      });
    } else {
      setFormData({
        shoulder: '',
        bust: '',
        waist: '',
        hips: '',
        height: '',
        notes: ''
      });
    }
    setIsSaved(false);
  }, [user, isOpen]);

  if (!user) return null;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setIsSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = updateMeasurements(formData);
    if (res.success) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000); // Reset save state after 3s
    }
  };

  const handleLogoutClick = () => {
    logout();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="profile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            className="profile-modal-container"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.15 }}
          >
            <div className="profile-modal dark-glass-panel">
              {/* Header */}
              <div className="profile-modal-header">
                <div className="header-title">
                  <Sparkles size={20} className="gold-icon animate-pulse-slow" />
                  <h3>Bespoke Profile</h3>
                </div>
                <button onClick={onClose} className="close-btn" aria-label="Close modal">
                  <X size={20} />
                </button>
              </div>

              {/* Tabs */}
              <div className="profile-tabs">
                <button 
                  className={`tab-btn ${activeTab === 'measurements' ? 'active' : ''}`}
                  onClick={() => setActiveTab('measurements')}
                >
                  <Ruler size={16} />
                  Bespoke Sizing
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <User size={16} />
                  Account details
                </button>
              </div>

              {/* Body */}
              <div className="profile-modal-body">
                {activeTab === 'measurements' ? (
                  <form onSubmit={handleSubmit} className="measurements-form">
                    <p className="measurements-desc">
                      Save your dimensions below. When booking a <strong>"Custom Fit"</strong> item, these details will automatically pre-fill your order request.
                    </p>

                    <div className="measurements-grid">
                      <div className="form-group">
                        <label>Shoulder <span className="unit">(inches)</span></label>
                        <input
                          type="number"
                          step="0.1"
                          name="shoulder"
                          placeholder="e.g. 14.5"
                          value={formData.shoulder}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Bust <span className="unit">(inches)</span></label>
                        <input
                          type="number"
                          step="0.1"
                          name="bust"
                          placeholder="e.g. 34.0"
                          value={formData.bust}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Waist <span className="unit">(inches)</span></label>
                        <input
                          type="number"
                          step="0.1"
                          name="waist"
                          placeholder="e.g. 28.0"
                          value={formData.waist}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Hips <span className="unit">(inches)</span></label>
                        <input
                          type="number"
                          step="0.1"
                          name="hips"
                          placeholder="e.g. 38.5"
                          value={formData.hips}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <label>Height <span className="unit">(e.g. 5'6" or 168cm)</span></label>
                      <input
                        type="text"
                        name="height"
                        placeholder="Help us gauge length & proportions"
                        value={formData.height}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Tailoring Notes / Alterations Preferences</label>
                      <textarea
                        name="notes"
                        rows="2"
                        placeholder="e.g. Prefer relaxed fits, standard sleeve length adjustments..."
                        value={formData.notes}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>

                    <div className="action-row">
                      {isSaved && <span className="save-success-msg">✨ Sizing profile updated!</span>}
                      <button type="submit" className="btn-primary save-measurements-btn">
                        Save Sizing Profile
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="account-details-view">
                    <div className="detail-card">
                      <div className="detail-item">
                        <span className="detail-label">Client Name</span>
                        <span className="detail-val">{user.name}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Email Address</span>
                        <span className="detail-val">{user.email}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Mobile Number</span>
                        <span className="detail-val">{user.mobile}</span>
                      </div>
                      {user.address && (
                        <div className="detail-item">
                          <span className="detail-label">Default Address</span>
                          <span className="detail-val">{user.address}</span>
                        </div>
                      )}
                      {user.pincode && (
                        <div className="detail-item">
                          <span className="detail-label">Pincode</span>
                          <span className="detail-val">{user.pincode}</span>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={handleLogoutClick} 
                      className="logout-action-btn"
                    >
                      <LogOut size={16} />
                      Log out of Account
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserProfileModal;
