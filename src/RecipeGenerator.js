import React from 'react';
import ReactMarkdown from "react-markdown";

function RecipeGenerator() {
  const [ingredients, setIngredients] = React.useState('');
  const [cuisine, setCuisine] = React.useState('any');
  const [dietaryRestrictions, setDietaryRestrictions] = React.useState('');
  const [recipe, setRecipe] = React.useState('');
  const createRecipe = async () => {
    const response = await fetch(`http://localhost:8080/recipe-generator?ingredients=${ingredients}&cuisine=${cuisine}&dietaryRestrictions=${dietaryRestrictions}`);
    //const response = await fetch(`https://recipe-generator-backend-0beu.onrender.com/recipe-generator?ingredients=${ingredients}&cuisine=${cuisine}&dietaryRestrictions=${dietaryRestrictions}`);
    const data = await response.text();
    console.log(data);
    setRecipe(data);
  }
  return (
    <div>
      <h2>Recipe Generator Component</h2>
      <input
        type="text"
        placeholder="Enter ingredients (comma separated)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter cuisine type"
        value={cuisine}
        onChange={(e) => setCuisine(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter dietary restrictions"
        value={dietaryRestrictions}
        onChange={(e) => setDietaryRestrictions(e.target.value)}
      />
      <button onClick={createRecipe}>Generate Recipe</button>
      <div className="output">
       <pre className="recipe-text"><ReactMarkdown>{recipe}</ReactMarkdown></pre>
      </div>
    </div>
  );
}

export default RecipeGenerator;
