import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import './GalleryPage.css';

const galleryImages = [
  {
    id: 1,
    title: 'The Making of the Royal Crimson Lehenga',
    description: 'A look into the meticulous hand-embroidery process.',
    poster: '/images/pexels-abhijith-ts-33843905-32856051.jpg'
  },
  {
    id: 2,
    title: 'Spring Summer Collection Showcase',
    description: 'Vibrant colors and flowing fabrics for the festive season.',
    poster: '/images/pexels-amodita-s-frame-485464413-33225585.jpg.jpg'
  },
  {
    id: 3,
    title: 'Bespoke Tailoring Details',
    description: 'Precision in every stitch.',
    poster: '/images/pexels-artworkbyumair-15226347.jpg'
  },
  {
    id: 4,
    title: 'Client Diaries',
    description: 'Real brides, real elegance.',
    poster: '/images/pexels-saurabh-chakraborty-214986446-12567318.jpg'
  }
];

const GalleryImageCard = ({ image }) => {
  return (
    <article className="gallery-image-card">
      <img src={image.poster} alt={image.title} loading="lazy" />
      <div className="gallery-image-caption">
        <h3>{image.title}</h3>
        <p>{image.description}</p>
      </div>
    </article>
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
          <p>Collection stories and studio diaries</p>
        </div>

        <div className="reels-grid">
          {galleryImages.map(image => (
            <GalleryImageCard key={image.id} image={image} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default GalleryPage;
