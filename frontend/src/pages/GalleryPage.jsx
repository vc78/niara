import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import './GalleryPage.css';

// Using extremely reliable static MP4s to prevent 403 errors and red screens.
// These are standard open-source demo videos hosted on reliable Google storage.
const videos = [
  {
    id: 1,
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    title: 'The Making of the Royal Crimson Lehenga',
    description: 'A look into the meticulous hand-embroidery process.',
    poster: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80'
  },
  {
    id: 2,
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    title: 'Spring Summer Collection Showcase',
    description: 'Vibrant colors and flowing fabrics for the festive season.',
    poster: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80'
  },
  {
    id: 3,
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    title: 'Bespoke Tailoring Details',
    description: 'Precision in every stitch.',
    poster: 'https://images.unsplash.com/photo-1584444569344-77e8a9f68809?w=600&q=80'
  },
  {
    id: 4,
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    title: 'Client Diaries',
    description: 'Real brides, real elegance.',
    poster: 'https://images.unsplash.com/photo-1594938298596-f00192e212f0?w=600&q=80'
  }
];

const VideoCard = ({ video }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      // Catch potential play() promise rejections to prevent crashing
      videoRef.current.play().catch(error => {
        console.error("Video playback failed:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Auto pause when out of viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
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
        className="gallery-video"
        poster={video.poster}
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
