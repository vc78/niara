import React from 'react';
import './Skeletons.css';

export const ProductGridSkeleton = ({ count = 6 }) => {
  return (
    <div className="product-grid-skeleton">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-img pulse"></div>
          <div className="skeleton-text-container">
            <div className="skeleton-title pulse"></div>
            <div className="skeleton-price pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const ProductGridError = ({ onRetry }) => {
  const handleWhatsApp = () => {
    window.open("https://wa.me/919030423317?text=Hi, I am having trouble viewing the collection on your website.", "_blank");
  };

  return (
    <div className="product-grid-error">
      <div className="error-icon">⚠️</div>
      <h3>Unable to Load Collection</h3>
      <p>We're having trouble fetching the latest designs. Please check your connection or try again.</p>
      <div className="error-actions">
        <button onClick={onRetry} className="btn-primary">Try Again</button>
        <button onClick={handleWhatsApp} className="btn-secondary">Contact via WhatsApp</button>
      </div>
    </div>
  );
};
