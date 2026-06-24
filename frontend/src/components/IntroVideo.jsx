import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './IntroVideo.css';

const IntroVideo = ({ onComplete }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [playError, setPlayError] = useState(true);
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

  const handleManualPlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setPlayError(false);
    }
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
            playsInline
            onEnded={handleVideoEnd}
          />
          {playError && (
            <div 
              onClick={handleManualPlay}
              style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 10, cursor: 'pointer',
                color: 'white', fontSize: '24px', fontWeight: 'bold'
              }}
            >
              <div style={{ background: 'var(--accent-gold)', padding: '15px 30px', borderRadius: '30px' }}>
                Tap to Play Audio
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroVideo;
