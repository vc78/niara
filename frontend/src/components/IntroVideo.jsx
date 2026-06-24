import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './IntroVideo.css';

const IntroVideo = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const videoRef = useRef(null);

  // Lock scrolling when the video is visible
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  const handleVideoEnd = () => {
    finishIntro();
  };

  const finishIntro = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 800); // Wait for fade out animation
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="intro-video-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <video
            ref={videoRef}
            className="intro-video-player"
            src="/videos/intro-video.mp4"
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroVideo;
