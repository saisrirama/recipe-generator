import React, { useState } from 'react';
import './App.css';
import RecipeGenerator from './RecipeGenerator';
import { Utensils, Menu, X } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('generator');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Lock scroll when mobile menu is open
  React.useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-logo">
          <Utensils size={28} color="#FF8C00" />
          <span>AI Recipe Generator</span>
        </div>

        <button className="mobile-menu-btn" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {isMenuOpen && (
          <div className="sidebar-backdrop" onClick={toggleMenu} />
        )}

        <div className={`nav-links ${isMenuOpen ? 'mobile-open' : ''}`}>
          <button
            className={`nav-link-btn ${activeTab === 'generator' ? 'active' : ''}`}
            onClick={() => handleNavClick('generator')}
          >
            Recipe Generator
          </button>
          <button
            className={`nav-link-btn ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => handleNavClick('favorites')}
          >
            My Favorites
          </button>
        </div>
      </nav>

      <main className="content-wrapper">
        <RecipeGenerator view={activeTab} />
      </main>
    </div>
  );
}

export default App;
