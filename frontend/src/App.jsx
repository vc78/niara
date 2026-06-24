import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import WishlistDrawer from './components/WishlistDrawer';
import UserProfileModal from './components/UserProfileModal';
import CollectionPage from './pages/CollectionPage';
import ProductPage from './components/ProductPage';
import GalleryPage from './pages/GalleryPage';
import WelcomePopup from './components/WelcomePopup';
import HotPicksDrawer from './components/HotPicksDrawer';
import HotPicksTab from './components/HotPicksTab';
import ContactModal from './components/ContactModal';
import './index.css';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHotPicksOpen, setIsHotPicksOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  
  const [currentRoute, setCurrentRoute] = useState('home'); // 'home' | 'collection' | 'product'
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeProduct, setActiveProduct] = useState(null);

  const navigateToCollection = (category = 'all') => {
    setActiveCategory(category);
    setCurrentRoute('collection');
    window.scrollTo(0, 0);
  };

  const navigateToProduct = (product) => {
    setActiveProduct(product);
    setCurrentRoute('product');
    window.scrollTo(0, 0);
  };

  const navigateToHome = () => {
    setCurrentRoute('home');
    window.scrollTo(0, 0);
  };

  const navigateToGallery = () => {
    setCurrentRoute('gallery');
    window.scrollTo(0, 0);
  };

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ToastProvider>
            <div className="app">
          {/* Global sticky navigation bar */}
          <Navbar 
            onCartOpen={() => setIsCartOpen(true)} 
            onAuthOpen={() => setIsAuthOpen(true)}
            onWishlistOpen={() => setIsWishlistOpen(true)}
            onProfileOpen={() => setIsProfileOpen(true)}
            onContactOpen={() => setIsContactOpen(true)}
            onNavigateToGallery={navigateToGallery}
          />
          
          {/* Main single-page scroll view or Collection view */}
          <main className="main-content">
            {currentRoute === 'home' ? (
              <Home 
                onAuthOpen={() => setIsAuthOpen(true)}
                onProfileOpen={() => setIsProfileOpen(true)}
                onNavigateToCollection={navigateToCollection}
                onProductClick={navigateToProduct}
              />
            ) : currentRoute === 'collection' ? (
              <CollectionPage 
                initialCategory={activeCategory}
                onBack={navigateToHome}
                onProductClick={navigateToProduct}
              />
            ) : currentRoute === 'product' && activeProduct ? (
              <ProductPage
                product={activeProduct}
                onBack={() => {
                  setCurrentRoute(activeCategory ? 'collection' : 'home');
                  window.scrollTo(0, 0);
                }}
              />
            ) : currentRoute === 'gallery' ? (
              <GalleryPage onBack={navigateToHome} />
            ) : null}
          </main>

          {/* Global floating side cart panel */}
          <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          
          {/* Global Wishlist Drawer */}
          <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
          
          {/* Global Auth Modal */}
          <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
          
          {/* Global Profile/Sizing Modal */}
          <UserProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

          {/* Global Contact Modal */}
          <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
          
          {/* New Features: Welcome Popup & Hot Picks */}
          <WelcomePopup onCartOpen={() => setIsCartOpen(true)} />
          <HotPicksTab onClick={() => setIsHotPicksOpen(true)} />
          <HotPicksDrawer 
            isOpen={isHotPicksOpen} 
            onClose={() => setIsHotPicksOpen(false)} 
            onCartOpen={() => setIsCartOpen(true)} 
          />
            </div>
          </ToastProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
