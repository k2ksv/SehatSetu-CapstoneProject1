// Utility Functions and Helpers for SehatSetu

// String utilities
const StringUtils = {
  // Capitalize first letter
  capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),

  // Convert to title case
  titleCase: (str) => str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),

  // Trim and normalize whitespace
  normalize: (str) => str.trim().replace(/\s+/g, ' '),

  // Truncate string with ellipsis
  truncate: (str, length = 50) => str.length > length ? str.substring(0, length) + '...' : str,

  // Check if string is empty
  isEmpty: (str) => !str || str.trim().length === 0,

  // Generate random string
  generateId: (length = 8) => Math.random().toString(36).substring(2, 2 + length)
};

// Array utilities
const ArrayUtils = {
  // Remove duplicates
  unique: (arr) => [...new Set(arr)],

  // Flatten nested array
  flatten: (arr) => arr.reduce((flat, item) => flat.concat(Array.isArray(item) ? ArrayUtils.flatten(item) : item), []),

  // Group array by key
  groupBy: (arr, key) => arr.reduce((groups, item) => {
    const groupKey = item[key];
    if (!groups[groupKey]) groups[groupKey] = [];
    groups[groupKey].push(item);
    return groups;
  }, {}),

  // Find object in array
  find: (arr, key, value) => arr.find(item => item[key] === value),

  // Sort array of objects
  sortBy: (arr, key, order = 'asc') => {
    const sorted = [...arr].sort((a, b) => a[key] > b[key] ? 1 : -1);
    return order === 'desc' ? sorted.reverse() : sorted;
  },

  // Chunk array into smaller arrays
  chunk: (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  }
};

// Date utilities
const DateUtils = {
  // Format date
  format: (date, format = 'DD/MM/YYYY') => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return format.replace('DD', day).replace('MM', month).replace('YYYY', year);
  },

  // Get days from now
  daysFromNow: (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  },

  // Check if date is today
  isToday: (date) => new Date(date).toDateString() === new Date().toDateString(),

  // Get time ago string
  timeAgo: (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (const [key, value] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / value);
      if (interval >= 1) return `${interval} ${key}${interval > 1 ? 's' : ''} ago`;
    }
    return 'Just now';
  }
};

// Object utilities
const ObjectUtils = {
  // Deep clone
  deepClone: (obj) => JSON.parse(JSON.stringify(obj)),

  // Merge objects
  merge: (...objects) => Object.assign({}, ...objects),

  // Get nested value
  get: (obj, path) => path.split('.').reduce((current, prop) => current?.[prop], obj),

  // Set nested value
  set: (obj, path, value) => {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => current[key] = current[key] || {}, obj);
    target[lastKey] = value;
    return obj;
  },

  // Check if object is empty
  isEmpty: (obj) => Object.keys(obj).length === 0
};

// Number utilities
const NumberUtils = {
  // Format currency
  formatCurrency: (num, currency = 'INR') => {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency
    });
    return formatter.format(num);
  },

  // Round to decimal places
  round: (num, decimals = 2) => Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals),

  // Format large numbers
  formatLarge: (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  },

  // Check if number is between range
  isBetween: (num, min, max) => num >= min && num <= max
};

// Export all utilities
const Utils = {
  String: StringUtils,
  Array: ArrayUtils,
  Date: DateUtils,
  Object: ObjectUtils,
  Number: NumberUtils
};
