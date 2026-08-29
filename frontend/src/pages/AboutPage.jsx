import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, Camera, MessageCircle, Sparkles, Award, Heart } from 'lucide-react';
import './AboutPage.css';

const AboutPage = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Parallax effect for the hero image
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity1 = useTransform(scrollY, [0, 500], [1, 0.35]);

  // Fade in animation variant
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="about-page">
      <div className="about-nav">
        <button onClick={onBack} className="about-back-btn touch-target" aria-label="Back to Home">
          <ArrowLeft size={18} /> <span>Back to Home</span>
        </button>
      </div>

      <div className="about-hero-section">
        <motion.div
          className="about-hero-image-container"
          style={{ y: y1, opacity: opacity1 }}
        >
          <img src="/hero-bg.jpg" alt="LABEL by SAHITHI NANDAN Atelier" onError={(e) => { e.currentTarget.src = '/images/thumbnail.jpg'; }} />
        </motion.div>
        <div className="about-hero-overlay">
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="about-hero-title"
          >
            From Passion to Profession
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="about-hero-subtitle"
          >
            Meet Sahithi Garlapati — The Heart Behind The Label
          </motion.p>
        </div>
      </div>

      <div className="about-content-wrapper section-px">
        {/* Founder Spotlight Card */}
        <motion.section
          className="founder-spotlight-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
        >
          <div className="founder-card-grid">
            <div className="founder-image-box">
              <img
                src="/images/founder.jpg"
                alt="Sahithi Garlapati — Founder & Chief Designer"
                className="founder-portrait-img"
                onError={(e) => { e.currentTarget.src = '/images/thumbnail.jpg'; }}
              />
              <div className="founder-badge">
                <Sparkles size={14} color="var(--accent-gold)" />
                <span>Founder & Chief Designer</span>
              </div>
            </div>

            <div className="founder-narrative">
              <div className="section-tag">
                <Award size={14} /> <span>Our Atelier Story</span>
              </div>
              <h2>The Founder's Vision</h2>
              <div className="accent-line-left"></div>
              <p>
                <strong>LABEL by SAHITHI NANDAN</strong> was born from a deep love for handcrafted, bespoke couture. <strong>Sahithi Garlapati</strong> built this label with an unwavering commitment to authentic craftsmanship, bespoke fittings, and timeless Indian silhouettes.
              </p>
              <p>
                Every piece reflects Sahithi's personal signature of excellence — blending heritage textiles, delicate zardozi embroidery, and modern silhouette tailoring designed to celebrate individuality.
              </p>

              <div className="founder-quote-banner">
                <p className="founder-quote-text">
                  "Quality is most important — that is our motto, every single day."
                </p>
                <span className="founder-signature">— Sahithi Garlapati</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Artisanal Heritage Showcase Grid */}
        <motion.section
          className="about-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
        >
          <motion.div className="about-grid-item" variants={fadeInUp}>
            <div className="grid-image-wrapper">
              <img
                src="/images/094da629-9762-47ae-ab65-206d042cc68c.png"
                alt="Hand-Curated Artisanal Collections"
                onError={(e) => { e.currentTarget.src = '/images/i1.png'; }}
              />
            </div>
            <h3>Handcrafted Haute Couture</h3>
            <p>Sahithi personally sources artisanal handloom weaves, rich organzas, and pure silks, curating bespoke ensembles with bespoke embroidery.</p>
          </motion.div>

          <motion.div className="about-grid-item" variants={fadeInUp}>
            <div className="grid-image-wrapper">
              <img
                src="/images/thumbnail.jpg"
                alt="Personal Trousseau Consultation"
                onError={(e) => { e.currentTarget.src = '/images/i2.png'; }}
              />
            </div>
            <h3>Personalized Styling & Care</h3>
            <p>Every bridal and festive client receives one-on-one styling guidance, bespoke custom measurement sizing, and direct master-craftsman oversight.</p>
          </motion.div>
        </motion.section>

        {/* Quote Section */}
        <motion.section
          className="about-quote"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
        >
          <blockquote>
            "When you wear a piece from LABEL by SAHITHI NANDAN, you are wearing passion, heritage, and a designer's true devotion."
          </blockquote>
          <cite>— Sahithi Garlapati</cite>
        </motion.section>

        {/* Social / Direct Connect Section */}
        <motion.section
          className="about-social"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h3>Connect with Our Atelier</h3>
          <p className="social-subtitle">Follow our latest bespoke showcases and talk directly with our design team.</p>
          <div className="social-links">
            <a
              href="https://www.instagram.com/label_by_sahithi_nandan/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon touch-target"
              title="Follow us on Instagram"
              aria-label="Follow us on Instagram"
            >
              <Camera size={22} />
            </a>
            <a
              href="https://wa.me/919000164752"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon touch-target"
              title="Chat on WhatsApp"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle size={22} />
            </a>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default AboutPage;

