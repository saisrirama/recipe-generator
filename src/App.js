import React, { useState } from 'react';
import './App.css';
import RecipeGenerator from './RecipeGenerator';
import { Utensils } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('generator');

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-logo">
          <Utensils size={28} color="#FF8C00" />
          <span>AI Recipe Generator</span>
        </div>
        <div className="nav-links">
          <button
            className={`nav-link-btn ${activeTab === 'generator' ? 'active' : ''}`}
            onClick={() => setActiveTab('generator')}
          >
            Recipe Generator
          </button>
          <button
            className={`nav-link-btn ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
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
