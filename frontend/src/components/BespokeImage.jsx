import React, { useState } from 'react';
import { Diamond } from 'lucide-react';
import heroImg from '../assets/hero.png';
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
        <img
          src={heroImg}
          alt={alt || 'Eedara Collection Item'}
          className="bespoke-image loaded"
        />
      </div>
    );
  }

  return (
    <div className={`bespoke-image-container ${className || ''}`} style={style}>
      <img
        src={src}
        alt={alt || "Eedara Collection Item"}
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
