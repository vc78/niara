// Label by Sahithi Nandan - 60 Item Product Database
// Categories: kurta-sets, co-ords, lehengas, festive-wear (15 items each)

const generateProducts = () => {
  const products = [];
  
  // KURTA SETS (15 items)
  const kurtaImages = [
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600',
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600',
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600'
  ];

  for(let i=1; i<=15; i++) {
    const originalPrice = 5000 + (i * 500);
    const discountPercent = i % 3 === 0 ? 15 : (i % 5 === 0 ? 25 : 0);
    const sellingPrice = originalPrice - (originalPrice * (discountPercent/100));
    
    products.push({
      id: `kurta-${i}`,
      name: `Hand-Embroidered Kurta Set ${i}`,
      category: 'kurta-sets',
      image: kurtaImages[i % kurtaImages.length],
      originalPrice,
      discountPercent,
      sellingPrice,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Dusty Rose', 'Sage Green', 'Ivory'],
      tag: i === 1 ? 'New' : (i === 5 ? 'Bestseller' : null),
      isNew: i <= 3
    });
  }

  // CO-ORDS (15 items)
  const coordImages = [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600',
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600',
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600'
  ];

  for(let i=1; i<=15; i++) {
    const originalPrice = 6000 + (i * 300);
    const discountPercent = i % 4 === 0 ? 20 : (i % 7 === 0 ? 30 : 0);
    const sellingPrice = originalPrice - (originalPrice * (discountPercent/100));
    
    products.push({
      id: `coord-${i}`,
      name: `Festive Silk Co-ord Set ${i}`,
      category: 'co-ords',
      image: coordImages[i % coordImages.length],
      originalPrice,
      discountPercent,
      sellingPrice,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Midnight Blue', 'Emerald Green', 'Wine'],
      tag: i === 2 ? 'New' : (i === 6 ? 'Limited' : null),
      isNew: i <= 2
    });
  }

  // LEHENGAS (15 items)
  const lehengaImages = [
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600',
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600',
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600'
  ];

  for(let i=1; i<=15; i++) {
    const originalPrice = 15000 + (i * 1500);
    const discountPercent = i % 2 === 0 ? 10 : (i % 5 === 0 ? 40 : 0);
    const sellingPrice = originalPrice - (originalPrice * (discountPercent/100));
    
    products.push({
      id: `lehenga-${i}`,
      name: `Bridal Chanderi Lehenga ${i}`,
      category: 'lehengas',
      image: lehengaImages[i % lehengaImages.length],
      originalPrice,
      discountPercent,
      sellingPrice,
      sizes: ['S', 'M', 'L', 'Custom'],
      colors: ['Crimson Red', 'Blush Pink', 'Champagne Gold'],
      tag: i === 1 ? 'Bestseller' : (i === 10 ? 'Limited' : null),
      isNew: i <= 4
    });
  }

  // FESTIVE WEAR (15 items)
  const festiveImages = [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600',
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600',
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600'
  ];

  for(let i=1; i<=15; i++) {
    const originalPrice = 8000 + (i * 800);
    const discountPercent = i % 3 === 0 ? 15 : 0;
    const sellingPrice = originalPrice - (originalPrice * (discountPercent/100));
    
    products.push({
      id: `festive-${i}`,
      name: `Zardozi Tissue Drape ${i}`,
      category: 'festive-wear',
      image: festiveImages[i % festiveImages.length],
      originalPrice,
      discountPercent,
      sellingPrice,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Forest Green', 'Mustard Yellow', 'Royal Purple'],
      tag: i === 3 ? 'New' : (i === 8 ? 'Bestseller' : null),
      isNew: i <= 5
    });
  }

  return products;
};

export const products = generateProducts();
