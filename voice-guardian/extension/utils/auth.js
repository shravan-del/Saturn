/**
 * Authentication utilities
 */

const Auth = {
  async isAuthenticated() {
    const token = localStorage.getItem('vg_token');
    const user = localStorage.getItem('vg_user');
    return !!(token && user);
  },
  
  async getUser() {
    try {
      const user = localStorage.getItem('vg_user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  },
  
  async getToken() {
    return localStorage.getItem('vg_token');
  },
  
  async logout() {
    localStorage.removeItem('vg_token');
    localStorage.removeItem('vg_user');
    localStorage.removeItem('vg_actions');
    return true;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Auth;
}