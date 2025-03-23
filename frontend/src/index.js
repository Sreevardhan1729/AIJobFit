import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client' for React 18


import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';

// Create a root and render the app
const root = ReactDOM.createRoot(document.getElementById('root'));  // Create a root using createRoot
root.render( 
  <Router>
    <App />
  </Router>
);
