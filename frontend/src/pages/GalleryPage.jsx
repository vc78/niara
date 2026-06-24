import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import './GalleryPage.css';

const videos = [
  {
    id: 1,
    url: 'https://player.vimeo.com/external/498263599.sd.mp4?s=d0023a105eb9f22c6bd42d1e21b711e6ed443fb7&profile_id=165&oauth2_token_id=57447761',
    title: 'The Making of the Royal Crimson Lehenga',
    description: 'A look into the meticulous hand-embroidery process.'
  },
  {
    id: 2,
    url: 'https://player.vimeo.com/external/477435163.sd.mp4?s=7b9264426f849b82875152a2ef4950e3262cc291&profile_id=165&oauth2_token_id=57447761',
    title: 'Spring Summer Collection Showcase',
    description: 'Vibrant colors and flowing fabrics for the festive season.'
  },
  {
    id: 3,
    url: 'https://player.vimeo.com/external/434045526.sd.mp4?s=c27ee3b4e6b52dcbb268cd155c56c2534ce644be&profile_id=165&oauth2_token_id=57447761',
    title: 'Bespoke Tailoring Details',
    description: 'Precision in every stitch.'
  },
  {
    id: 4,
    url: 'https://player.vimeo.com/external/416035987.sd.mp4?s=404222cd81a0279611db70a30b6528d227c28dd6&profile_id=165&oauth2_token_id=57447761',
    title: 'Client Diaries',
    description: 'Real brides, real elegance.'
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
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Auto pause when out of viewport (simple intersection observer)
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
        poster="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80"
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

      <section className="ideology-section">
        <div className="ideology-content">
          <h1 className="ideology-title">Our Ideology</h1>
          <div className="ideology-divider"></div>
          <p className="ideology-text">
            At <strong>Label by Sahithi Nandhan</strong>, we believe that fashion is an intimate expression of identity. Our journey began with a simple vision: to create heirloom pieces that transcend fleeting trends.
          </p>
          <p className="ideology-text">
            Every garment is a labor of love, marrying centuries-old Indian craftsmanship with contemporary silhouettes. We champion ethical sourcing, bespoke tailoring, and an uncompromising commitment to detail. 
          </p>
          <p className="ideology-text">
            When you wear a piece from our collection, you aren't just wearing fabric—you are wearing art, passion, and a legacy woven into every thread.
          </p>
        </div>
        <div className="ideology-image">
          <img src="https://images.unsplash.com/photo-1596455607563-ad6193f76b17?w=1200&q=80" alt="Brand Ideology" />
        </div>
      </section>

      <section className="reels-section">
        <div className="reels-header">
          <h2>Behind the Seams</h2>
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
