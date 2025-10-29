/**
 * API utilities
 */

const API = {
  BASE_URL: 'http://localhost:8000',
  
  async request(endpoint, options = {}) {
    const token = await Auth.getToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${this.BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'API request failed');
    }
    
    return await response.json();
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = API;
}