import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, Camera, Globe, MessageCircle, Mail } from 'lucide-react';
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
          {/* Using reliable Unsplash images of Indian bridal wear */}
          <img src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1600&q=80" alt="Boutique Ideology Hero" />
        </motion.div>
        <div className="about-hero-overlay">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="about-hero-title"
          >
            From Passion to Profession
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="about-hero-subtitle"
          >
            Meet Navya Sri Namburi — the heart behind Sree Vastra
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
          <h2>The Founder's Story</h2>
          <div className="accent-line"></div>
          <p>
            Sree Vastra was born from a deep love for quality fabrics and authentic Indian fashion. <strong>Navya Sri Namburi</strong> — a passionate entrepreneur — built this brand with her own hands, from curating every fabric to personally connecting with each customer. At Sree Vastra, quality isn't just a promise — it's our foundation.
          </p>
          <p>
            Every piece that leaves our atelier bears Navya's personal stamp of excellence. She doesn't just design clothes; she designs dreams. From the selection of the finest cottons and silks to the meticulous hand-embroidery, every garment is a testament to her unwavering commitment to quality and her love for authentic Indian fashion.
          </p>
          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            borderLeft: '4px solid #F9A825',
            backgroundColor: '#FAF7F2',
            borderRadius: '0.5rem'
          }}>
            <p style={{ fontStyle: 'italic', fontWeight: 600, color: '#2d2d2d', margin: 0 }}>
              "Quality is most important — that's our motto."
            </p>
            <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>
              — Navya Sri Namburi, Founder & Creative Director
            </p>
          </div>
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
              <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80" alt="Hand-Curated Collections" />
            </div>
            <h3>Hand-Curated Collections</h3>
            <p>Navya personally selects every fabric, every color, and every design. She spends weeks sourcing the finest materials from trusted artisans across India, ensuring that every piece meets her exacting standards for quality and beauty.</p>
          </motion.div>

          <motion.div className="about-grid-item" variants={fadeInUp}>
            <div className="grid-image-wrapper">
              <img src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80" alt="Personal Connection" />
            </div>
            <h3>Personal Connection</h3>
            <p>Every customer is important to Navya. She believes in building relationships, not just transactions. From custom measurements to style consultations, she's involved in every step of your journey with Sree Vastra.</p>
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
            "When you wear a piece from Sree Vastra, you're not just wearing fabric—you're wearing passion, integrity, and a woman entrepreneur's dream."
          </blockquote>
          <cite>— Navya Sri Namburi</cite>
        </motion.section>

        <motion.section
          className="about-social"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h3>Connect With Us</h3>
          <div className="social-links">
            <a href="https://www.instagram.com/sreevastrakhammam?igsh=MWpteWRiZ2xuOTVmcg==" target="_blank" rel="noopener noreferrer" className="social-icon" title="Follow us on Instagram">
              <Camera size={24} />
            </a>
            <a href="https://wa.me/919030423317" target="_blank" rel="noopener noreferrer" className="social-icon" title="Chat on WhatsApp">
              <MessageCircle size={24} />
            </a>
            <a href="mailto:contact@sreevastra.com" className="social-icon" title="Email us">
              <Mail size={24} />
            </a>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default AboutPage;
