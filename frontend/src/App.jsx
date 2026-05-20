import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import WishlistDrawer from './components/WishlistDrawer';
import UserProfileModal from './components/UserProfileModal';
import './index.css';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <div className="app">
          {/* Global sticky navigation bar */}
          <Navbar 
            onCartOpen={() => setIsCartOpen(true)} 
            onAuthOpen={() => setIsAuthOpen(true)}
            onWishlistOpen={() => setIsWishlistOpen(true)}
            onProfileOpen={() => setIsProfileOpen(true)}
          />
          
          {/* Main single-page scroll view */}
          <main className="main-content">
            <Home />
          </main>

          {/* Global floating side cart panel */}
          <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          
          {/* Global Wishlist Drawer */}
          <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
          
          {/* Global Auth Modal */}
          <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
          
          {/* Global Profile/Sizing Modal */}
          <UserProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </div>
      </WishlistProvider>
    </CartProvider>
  </AuthProvider>
  );
}

export default App;
