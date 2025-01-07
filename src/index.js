import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

/**
 * Entry point of the React application.
 * Renders the App component into the #root element.
 */
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
