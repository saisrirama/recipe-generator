import React, { useState } from 'react';
import './App.css';
import RecipeGenerator from './RecipeGenerator';

function App() {
  const [activeTab, setActiveTab] = useState('recipe-generator');

  const handleTabChange = (tab) => {
    // alert(`Switching to ${tab} tab`);
    setActiveTab(tab);
  }

  return (
    <div className="App">
      <button className={activeTab === 'home' ? 'active' : ''}
      onClick={() => handleTabChange('home')}>Home</button>
      <button className={activeTab === 'recipe-generator' ? 'active' : ''}
      onClick={() => handleTabChange('recipe-generator')}>Recipe Generator</button>

<div>
      {activeTab === 'home' && (
        <div>
          <h1>Welcome to the Home Page</h1>
          <p>This is the home tab content.</p>
        </div>
      )}
      {/* Conditional Rendering - && */}
      {activeTab === 'recipe-generator' && <RecipeGenerator/>}

    </div>

    
    
    </div>

  );
}

export default App;
