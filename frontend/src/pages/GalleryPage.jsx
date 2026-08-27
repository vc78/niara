import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import './GalleryPage.css';

// Using local video files from public/images with local thumbnails
const videos = [
  {
    id: 1,
    url: '/images/v1.mp4',
    title: 'The Making of the Royal Crimson Lehenga',
    description: 'A look into the meticulous hand-embroidery process.',
    poster: '/images/pexels-abhijith-ts-33843905-32856051.jpg'
  },
  {
    id: 2,
    url: '/images/v2.mp4',
    title: 'Spring Summer Collection Showcase',
    description: 'Vibrant colors and flowing fabrics for the festive season.',
    poster: '/images/pexels-amodita-s-frame-485464413-33225585.jpg.jpg'
  },
  {
    id: 3,
    url: '/images/v3.mp4',
    title: 'Bespoke Tailoring Details',
    description: 'Precision in every stitch.',
    poster: '/images/pexels-artworkbyumair-15226347.jpg'
  },
  {
    id: 4,
    url: '/images/v4.mp4',
    title: 'Client Diaries',
    description: 'Real brides, real elegance.',
    poster: '/images/pexels-saurabh-chakraborty-214986446-12567318.jpg'
  }
];

const VideoCard = ({ video }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasPlaybackError, setHasPlaybackError] = useState(false);

  const togglePlay = async (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      try {
        setHasPlaybackError(false);
        await videoRef.current.play();
      } catch {
        setHasPlaybackError(true);
      }
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Auto pause when out of viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current) {
          if (!entry.isIntersecting && isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, [isPlaying]);

  return (
    <div className="video-card" onClick={togglePlay}>
      <video
        ref={videoRef}
        src={video.url}
        loop
        muted={isMuted}
        playsInline
        controls
        preload="metadata"
        className="gallery-video"
        poster={video.poster}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => setHasPlaybackError(true)}
      />
      <div className="video-controls">
        <button className="control-btn" onClick={togglePlay}>
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button className="control-btn" onClick={toggleMute}>
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>
      <div className="video-overlay">
        <h3>{video.title}</h3>
        <p>{video.description}</p>
      </div>
      {hasPlaybackError && (
        <p className="video-error" role="alert">This video could not be loaded. Please try again.</p>
      )}
    </div>
  );
};

const GalleryPage = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="gallery-page">
      <div className="gallery-header-nav">
        <button onClick={onBack} className="gallery-back-btn">
          <ArrowLeft size={20} /> Back to Home
        </button>
      </div>

      <section className="reels-section" style={{ marginTop: '40px' }}>
        <div className="reels-header">
          <h2>Video Gallery</h2>
          <p>Shorts, Reels, and Studio Diaries</p>
        </div>

        <div className="reels-grid">
          {videos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default GalleryPage;
