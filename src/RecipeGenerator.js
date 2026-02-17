import React, { useState, useEffect } from 'react';
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChefHat,
  Trash2,
  Sparkles,
  Copy,
  Heart,
  RefreshCw,
  CheckCircle2,
  Calendar,
  UtensilsCrossed
} from 'lucide-react';

const CUISINES = [
  'Italian', 'Indian', 'Japanese', 'Mexican', 'Chinese',
  'French', 'Thai', 'Mediterranean', 'American', 'Random'
];

const DIETARY_OPTIONS = [
  'Gluten Free', 'Vegan', 'Vegetarian', 'Keto',
  'Dairy Free', 'High Protein', 'Low Carb'
];

function RecipeGenerator({ view }) {
  const [ingredients, setIngredients] = useState('');
  const [cuisine, setCuisine] = useState('Italian');
  const [selectedDietary, setSelectedDietary] = useState([]);
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showNotification, setShowNotification] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('recipe_favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const toggleDietary = (option) => {
    setSelectedDietary(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const createRecipe = async () => {
    if (!ingredients.trim()) return;

    setLoading(true);
    setRecipe('');

    const dietaryStr = selectedDietary.join(', ');
    const url = `http://localhost:8080/recipe-generator?ingredients=${encodeURIComponent(ingredients)}&cuisine=${encodeURIComponent(cuisine)}&dietaryRestrictions=${encodeURIComponent(dietaryStr)}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.text();
      setRecipe(data);
    } catch (error) {
      console.error("Error generating recipe:", error);
      if (error.name === 'AbortError') {
        setRecipe("### ⚠️ Request Timed Out\nThe chef is taking a bit too long. Hugging Face might be busy. Please try again.");
      } else {
        setRecipe("### ⚠️ Oops! Something went wrong\nCould not connect to the kitchen. Please check if the backend is running and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setIngredients('');
    setCuisine('Italian');
    setSelectedDietary([]);
    setRecipe('');
  };

  const handleSaveRecipe = () => {
    if (!recipe) return;

    // Extract title from markdown if possible (look for # Title or **Title**)
    const titleMatch = recipe.match(/# (.*)/) || recipe.match(/\*\*(.*)\*\*/);
    const title = titleMatch ? titleMatch[1] : `Recipe ${favorites.length + 1}`;

    const newFavorite = {
      id: Date.now(),
      title,
      content: recipe,
      date: new Date().toLocaleDateString(),
      cuisine: cuisine,
      dietary: selectedDietary
    };

    const updated = [newFavorite, ...favorites];
    setFavorites(updated);
    localStorage.setItem('recipe_favorites', JSON.stringify(updated));

    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const deleteFavorite = (id) => {
    const updated = favorites.filter(f => f.id !== id);
    setFavorites(updated);
    localStorage.setItem('recipe_favorites', JSON.stringify(updated));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Recipe copied to clipboard!");
  };

  if (view === 'favorites') {
    return (
      <div className="glass-card">
        <header className="header">
          <Heart size={48} color="#FF8C00" style={{ marginBottom: '16px' }} />
          <h1>My Favorites</h1>
          <p>Your collection of saved culinary masterpieces</p>
        </header>

        <div className="favorites-list">
          {favorites.length === 0 ? (
            <div className="empty-state">
              <UtensilsCrossed size={40} color="#CCC" />
              <p>No favorites yet. Start generating and save some!</p>
            </div>
          ) : (
            favorites.map((fav) => (
              <motion.div
                key={fav.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="favorite-item"
              >
                <div className="fav-info">
                  <h3>{fav.title}</h3>
                  <div className="fav-meta">
                    <span className="meta-badge"><Calendar size={12} /> {fav.date}</span>
                    <span className="meta-badge">{fav.cuisine}</span>
                  </div>
                </div>
                <div className="fav-actions">
                  <button className="action-btn" onClick={() => setRecipe(fav.content)}>
                    View
                  </button>
                  <button className="action-btn text-red" onClick={() => deleteFavorite(fav.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {recipe && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="recipe-output full-view"
            style={{ marginTop: '40px' }}
          >
            <div className="recipe-content">
              <ReactMarkdown>{recipe}</ReactMarkdown>
            </div>
            <div className="recipe-actions">
              <button className="action-btn" onClick={() => copyToClipboard(recipe)}>
                <Copy size={18} /> Copy
              </button>
              <button className="action-btn" onClick={() => setRecipe('')}>
                Close
              </button>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="glass-card">
      <header className="header">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ChefHat size={48} color="#FF8C00" style={{ marginBottom: '16px' }} />
        </motion.div>
        <h1>AI Recipe Generator</h1>
        <p>"Turn your ingredients into magic"</p>
      </header>

      <div className="form-container">
        <div className="form-group">
          <label className="form-label">What's in your pantry?</label>
          <textarea
            className="input-field"
            rows="3"
            placeholder="e.g. Tomatoes, Garlic, Pasta, Basil..."
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Cuisine Type</label>
          <select
            className="input-field select-field"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
          >
            {CUISINES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Dietary Restrictions</label>
          <div className="chip-container">
            {DIETARY_OPTIONS.map(option => (
              <motion.div
                key={option}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`chip ${selectedDietary.includes(option) ? 'active' : ''}`}
                onClick={() => toggleDietary(option)}
              >
                {option}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="button-group">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-primary"
            onClick={createRecipe}
            disabled={loading || !ingredients.trim()}
          >
            <Sparkles size={20} />
            {loading ? 'Cooking...' : 'Generate Recipe'}
          </motion.button>

          <button className="btn btn-secondary" onClick={clearAll}>
            <Trash2 size={20} />
            Clear
          </button>
        </div>
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="loading-container"
          >
            <div className="spinner"></div>
            <p className="loading-text">Chef is thinking...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {recipe && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="recipe-output"
          >
            <div className="recipe-content">
              <ReactMarkdown>{recipe}</ReactMarkdown>
            </div>

            <div className="recipe-actions">
              <button className="action-btn" onClick={() => copyToClipboard(recipe)}>
                <Copy size={18} />
                Copy
              </button>
              <button
                className={`action-btn ${favorites.some(f => f.content === recipe) ? 'saved' : ''}`}
                onClick={handleSaveRecipe}
              >
                <Heart size={18} fill={favorites.some(f => f.content === recipe) ? "#FF8C00" : "transparent"} />
                {favorites.some(f => f.content === recipe) ? 'Saved' : 'Save'}
              </button>
              <button className="action-btn" onClick={createRecipe}>
                <RefreshCw size={18} />
                Regenerate
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="notification"
          >
            <CheckCircle2 size={20} color="#FFF" />
            Recipe saved to favorites!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default RecipeGenerator;
