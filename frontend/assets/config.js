// Environment Configuration for SehatSetu
// Automatically detects the environment and sets the correct backend URL

const getBackendUrl = () => {
  const hostname = window.location.hostname;
  
  // GitHub Pages domain
  if (hostname.includes('github.io')) {
    return 'https://sehatsetu-app.onrender.com';
  }
  
  // Render backend
  if (hostname.includes('render.com')) {
    return 'https://sehatsetu-app.onrender.com';
  }
  
  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8000';
  }
  
  // Production Render URL
  return 'https://sehatsetu-app.onrender.com';
};

const backendUrl = getBackendUrl();

console.log(`SehatSetu Backend URL: ${backendUrl} (from ${window.location.hostname})`);
