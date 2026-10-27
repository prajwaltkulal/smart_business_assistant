/**
 * Utility: Local Storage Wrapper
 * Purpose: Safe local storage getters and setters
 * Owner: Shared
 */

export const storage = {
  get: (key, defaultVal = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultVal;
    } catch {
      return defaultVal;
    }
  },
  set: (key, val) => {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (err) {
      console.error('Storage write error', err);
    }
  },
  remove: (key) => localStorage.removeItem(key)
};
