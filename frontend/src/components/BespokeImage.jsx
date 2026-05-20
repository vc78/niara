import React, { useState } from 'react';
import { Diamond } from 'lucide-react';
import './BespokeImage.css';

const BespokeImage = ({ src, alt, className, style, ...props }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  if (hasError || !src) {
    return (
      <div className={`bespoke-image-container ${className || ''}`} style={style}>
        <div className="bespoke-fallback">
          <Diamond size={32} className="bespoke-fallback-icon" />
          <div className="bespoke-fallback-text">NIARA</div>
          <div className="bespoke-fallback-sub">Exclusive Collection</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bespoke-image-container ${className || ''}`} style={style}>
      <img
        src={src}
        alt={alt || "Niara Collection Item"}
        className={`bespoke-image ${isLoaded ? 'loaded' : 'loading'}`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
        {...props}
      />
    </div>
  );
};

export default BespokeImage;
