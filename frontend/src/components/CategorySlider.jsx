import React from 'react';
import { motion } from 'framer-motion';
import './CategorySlider.css';

const categories = [
  { id: 'sarees', name: 'Saree', image: '/images/i1.png' },
  { id: 'blouses', name: 'Blouse', image: '/images/i5.png' },
  { id: 'co-ords', name: 'Pre Draped', image: '/images/i8.png' },
  { id: 'dresses', name: 'Dresses', image: '/images/i2.png' },
  { id: 'kurta-sets', name: 'Kurta', image: '/images/i6.png' },
  { id: 'lehengas', name: 'Lehenga', image: '/images/i9.png' },
  { id: 'men', name: 'Men', image: '/images/i3.png' },
  { id: 'festive-wear', name: 'Combo', image: '/images/i7.png' }
];

const CategorySlider = ({ onNavigateToCollection }) => {
  return (
    <section className="category-slider-section">
      <div className="category-slider-header">
        <h2 className="category-slider-title">
          <span className="heart-icon">❤️</span> DIPPED IN LOVE <span className="heart-icon">❤️</span>
        </h2>
        <p className="category-slider-subtitle">
          India's most loved Artisanal brand, handcrafted with authentic luxury
        </p>
      </div>

      <div className="category-slider-container">
        <div className="category-scroll-area">
          {categories.map((category, index) => (
            <motion.div 
              key={category.id}
              className="category-circle-item"
              onClick={() => onNavigateToCollection(category.id)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
            >
              <div className="category-circle-img-wrapper">
                <img src={category.image} alt={category.name} className="category-circle-img" loading="lazy" />
              </div>
              <span className="category-circle-name">{category.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySlider;
