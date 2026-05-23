// Local Storage Management for SehatSetu

const Storage = {
  // Set item in localStorage
  set: (key, value) => {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, stringValue);
      return true;
    } catch (error) {
      console.error('Storage.set error:', error);
      return false;
    }
  },

  // Get item from localStorage
  get: (key) => {
    try {
      const value = localStorage.getItem(key);
      if (!value) return null;
      
      // Try to parse as JSON, otherwise return as string
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error('Storage.get error:', error);
      return null;
    }
  },

  // Remove item from localStorage
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage.remove error:', error);
      return false;
    }
  },

  // Clear all localStorage
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Storage.clear error:', error);
      return false;
    }
  },

  // Check if key exists
  exists: (key) => localStorage.getItem(key) !== null,

  // Get all keys
  getAllKeys: () => Object.keys(localStorage),

  // Get all items as object
  getAll: () => {
    const result = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      result[key] = Storage.get(key);
    }
    return result;
  },

  // Set multiple items
  setMultiple: (items) => {
    for (const [key, value] of Object.entries(items)) {
      Storage.set(key, value);
    }
  },

  // Remove multiple items
  removeMultiple: (keys) => {
    keys.forEach(key => Storage.remove(key));
  },

  // Get with default value
  getOrDefault: (key, defaultValue) => {
    const value = Storage.get(key);
    return value !== null ? value : defaultValue;
  },

  // Set item with expiration
  setWithExpiry: (key, value, expiryMs) => {
    const item = {
      value: typeof value === 'string' ? value : JSON.stringify(value),
      expiry: Date.now() + expiryMs
    };
    localStorage.setItem(key, JSON.stringify(item));
  },

  // Get item with expiry check
  getWithExpiry: (key) => {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      if (!item.expiry) return Storage.get(key); // Old format without expiry

      if (Date.now() > item.expiry) {
        Storage.remove(key);
        return null;
      }

      try {
        return JSON.parse(item.value);
      } catch {
        return item.value;
      }
    } catch (error) {
      console.error('Storage.getWithExpiry error:', error);
      return null;
    }
  },

  // Increment counter
  increment: (key, amount = 1) => {
    const current = parseInt(Storage.get(key) || 0);
    Storage.set(key, current + amount);
    return current + amount;
  },

  // Decrement counter
  decrement: (key, amount = 1) => {
    const current = parseInt(Storage.get(key) || 0);
    Storage.set(key, current - amount);
    return current - amount;
  },

  // Append to array
  pushArray: (key, value) => {
    let arr = Storage.get(key) || [];
    if (!Array.isArray(arr)) arr = [];
    arr.push(value);
    Storage.set(key, arr);
    return arr;
  },

  // Remove from array
  popArray: (key) => {
    let arr = Storage.get(key) || [];
    if (!Array.isArray(arr)) arr = [];
    const value = arr.pop();
    Storage.set(key, arr);
    return value;
  },

  // Get storage size (rough estimate in KB)
  getSize: () => {
    let size = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        size += localStorage[key].length + key.length;
      }
    }
    return (size / 1024).toFixed(2) + ' KB';
  },

  // Database-like operations
  database: {
    // Create table (array of objects)
    createTable: (tableName, initialData = []) => {
      Storage.set(`_table_${tableName}`, initialData);
    },

    // Insert record
    insert: (tableName, record) => {
      const table = Storage.get(`_table_${tableName}`) || [];
      record.id = record.id || Date.now();
      table.push(record);
      Storage.set(`_table_${tableName}`, table);
      return record;
    },

    // Get all records
    find: (tableName) => Storage.get(`_table_${tableName}`) || [],

    // Find by condition
    findBy: (tableName, condition) => {
      const table = Storage.get(`_table_${tableName}`) || [];
      return table.filter(record => {
        for (const [key, value] of Object.entries(condition)) {
          if (record[key] !== value) return false;
        }
        return true;
      });
    },

    // Update record
    update: (tableName, id, updates) => {
      const table = Storage.get(`_table_${tableName}`) || [];
      const record = table.find(r => r.id === id);
      if (record) {
        Object.assign(record, updates);
        Storage.set(`_table_${tableName}`, table);
      }
      return record;
    },

    // Delete record
    delete: (tableName, id) => {
      const table = Storage.get(`_table_${tableName}`) || [];
      const index = table.findIndex(r => r.id === id);
      if (index > -1) {
        const deleted = table.splice(index, 1);
        Storage.set(`_table_${tableName}`, table);
        return deleted[0];
      }
      return null;
    },

    // Drop table
    dropTable: (tableName) => Storage.remove(`_table_${tableName}`)
  }
};
