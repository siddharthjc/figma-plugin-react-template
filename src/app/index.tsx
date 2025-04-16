import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';

document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('react-page');
  if (container) {
    const root = createRoot(container);
    root.render(<App />);
  } else {
    console.error("Could not find container element with id 'react-page'");
  }
});
