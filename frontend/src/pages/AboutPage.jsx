import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import './AboutPage.css';

const AboutPage = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Parallax effect for the hero image
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity1 = useTransform(scrollY, [0, 500], [1, 0.3]);

  // Fade in animation variant
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  return (
    <div className="about-page">
      <div className="about-nav">
        <button onClick={onBack} className="about-back-btn">
          <ArrowLeft size={20} /> Back to Home
        </button>
      </div>

      <div className="about-hero-section">
        <motion.div 
          className="about-hero-image-container"
          style={{ y: y1, opacity: opacity1 }}
        >
          <img src="https://images.unsplash.com/photo-1596455607563-ad6193f76b17?w=1600&q=80" alt="Boutique Ideology Hero" />
        </motion.div>
        <div className="about-hero-overlay">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="about-hero-title"
          >
            Our Ideology
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="about-hero-subtitle"
          >
            A legacy woven in every thread
          </motion.p>
        </div>
      </div>

      <div className="about-content-wrapper">
        <motion.section 
          className="about-statement"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <h2>The Craft of Identity</h2>
          <div className="accent-line"></div>
          <p>
            At <strong>Label by Sahithi Nandhan</strong>, we believe that fashion is an intimate expression of identity. Our journey began with a simple vision: to create heirloom pieces that transcend fleeting trends.
          </p>
          <p>
            Every garment is a labor of love, marrying centuries-old Indian craftsmanship with contemporary silhouettes. We champion ethical sourcing, bespoke tailoring, and an uncompromising commitment to detail.
          </p>
        </motion.section>

        <motion.section 
          className="about-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div className="about-grid-item" variants={fadeInUp}>
            <div className="grid-image-wrapper">
              <img src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80" alt="Craftsmanship" />
            </div>
            <h3>Artisanal Craftsmanship</h3>
            <p>Our artisans employ traditional techniques passed down through generations, ensuring every piece carries the soul of true artistry.</p>
          </motion.div>

          <motion.div className="about-grid-item" variants={fadeInUp}>
            <div className="grid-image-wrapper">
              <img src="https://images.unsplash.com/photo-1584444569344-77e8a9f68809?w=800&q=80" alt="Bespoke" />
            </div>
            <h3>Bespoke Tailoring</h3>
            <p>We tailor dreams into reality. Our bespoke service is an intimate collaboration, ensuring your garment is as unique as your fingerprint.</p>
          </motion.div>
        </motion.section>

        <motion.section 
          className="about-quote"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <blockquote>
            "When you wear a piece from our collection, you aren't just wearing fabric—you are wearing art, passion, and a legacy."
          </blockquote>
          <cite>— Sahithi Nandhan</cite>
        </motion.section>
      </div>
    </div>
  );
};

export default AboutPage;
