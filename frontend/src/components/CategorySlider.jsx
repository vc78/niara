import React from 'react';
import { motion } from 'framer-motion';
import './CategorySlider.css';

const categories = [
  { id: 'sarees', name: 'Saree', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80' },
  { id: 'blouses', name: 'Blouse', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=300&q=80' },
  { id: 'co-ords', name: 'Pre Draped', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80' },
  { id: 'dresses', name: 'Dresses', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80' },
  { id: 'kurta-sets', name: 'Kurta', image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=300&q=80' },
  { id: 'lehengas', name: 'Lehenga', image: 'https://images.unsplash.com/photo-1585914924626-15adac1e6402?auto=format&fit=crop&w=300&q=80' },
  { id: 'men', name: 'Men', image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=300&q=80' },
  { id: 'festive-wear', name: 'Combo', image: 'https://images.unsplash.com/photo-1585914924626-15adac1e6402?auto=format&fit=crop&w=300&q=80' }
];

const CategorySlider = ({ onNavigateToCollection }) => {
  return (
    <section className="category-slider-section">
      <div className="category-slider-header">
        <h2 className="category-slider-title">
          <span className="heart-icon">❤️</span> DIPPED IN LOVE <span className="heart-icon">❤️</span>
        </h2>
        <p className="category-slider-subtitle">
          India's most loved Artisanal brand, handcrafted by 17000+ artisans
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
              transition={{ delay: index * 0.1, duration: 0.5 }}
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
