// DOM Manipulation Helpers for SehatSetu

const DOM = {
  // Select element(s)
  select: (selector) => document.querySelector(selector),
  selectAll: (selector) => document.querySelectorAll(selector),
  byId: (id) => document.getElementById(id),

  // Create element
  create: (tag, attributes = {}, content = '') => {
    const element = document.createElement(tag);
    for (const [key, value] of Object.entries(attributes)) {
      if (key === 'class') {
        element.className = value;
      } else if (key === 'style') {
        Object.assign(element.style, value);
      } else {
        element.setAttribute(key, value);
      }
    }
    if (content) {
      if (typeof content === 'string') {
        element.innerHTML = content;
      } else {
        element.appendChild(content);
      }
    }
    return element;
  },

  // Add class
  addClass: (element, className) => {
    if (typeof element === 'string') element = document.querySelector(element);
    element?.classList.add(className);
  },

  // Remove class
  removeClass: (element, className) => {
    if (typeof element === 'string') element = document.querySelector(element);
    element?.classList.remove(className);
  },

  // Toggle class
  toggleClass: (element, className) => {
    if (typeof element === 'string') element = document.querySelector(element);
    element?.classList.toggle(className);
  },

  // Has class
  hasClass: (element, className) => {
    if (typeof element === 'string') element = document.querySelector(element);
    return element?.classList.contains(className) || false;
  },

  // Set text content
  setText: (element, text) => {
    if (typeof element === 'string') element = document.querySelector(element);
    if (element) element.textContent = text;
  },

  // Set HTML content
  setHtml: (element, html) => {
    if (typeof element === 'string') element = document.querySelector(element);
    if (element) element.innerHTML = html;
  },

  // Get text content
  getText: (element) => {
    if (typeof element === 'string') element = document.querySelector(element);
    return element?.textContent || '';
  },

  // Show element
  show: (element) => {
    if (typeof element === 'string') element = document.querySelector(element);
    if (element) element.style.display = '';
  },

  // Hide element
  hide: (element) => {
    if (typeof element === 'string') element = document.querySelector(element);
    if (element) element.style.display = 'none';
  },

  // Toggle visibility
  toggle: (element) => {
    if (typeof element === 'string') element = document.querySelector(element);
    if (element) element.style.display = element.style.display === 'none' ? '' : 'none';
  },

  // Set attributes
  setAttr: (element, attributes) => {
    if (typeof element === 'string') element = document.querySelector(element);
    for (const [key, value] of Object.entries(attributes)) {
      element?.setAttribute(key, value);
    }
  },

  // Get attribute
  getAttr: (element, attr) => {
    if (typeof element === 'string') element = document.querySelector(element);
    return element?.getAttribute(attr) || null;
  },

  // Remove attribute
  removeAttr: (element, attr) => {
    if (typeof element === 'string') element = document.querySelector(element);
    element?.removeAttribute(attr);
  },

  // Set value (for inputs)
  setValue: (element, value) => {
    if (typeof element === 'string') element = document.querySelector(element);
    if (element) element.value = value;
  },

  // Get value (for inputs)
  getValue: (element) => {
    if (typeof element === 'string') element = document.querySelector(element);
    return element?.value || '';
  },

  // Add event listener
  on: (element, event, callback) => {
    if (typeof element === 'string') {
      document.querySelectorAll(element).forEach(el => el.addEventListener(event, callback));
    } else {
      element?.addEventListener(event, callback);
    }
  },

  // Remove event listener
  off: (element, event, callback) => {
    if (typeof element === 'string') element = document.querySelector(element);
    element?.removeEventListener(event, callback);
  },

  // Append child
  append: (parent, child) => {
    if (typeof parent === 'string') parent = document.querySelector(parent);
    if (typeof child === 'string') child = document.querySelector(child);
    parent?.appendChild(child);
  },

  // Prepend child
  prepend: (parent, child) => {
    if (typeof parent === 'string') parent = document.querySelector(parent);
    if (typeof child === 'string') child = document.querySelector(child);
    parent?.insertBefore(child, parent.firstChild);
  },

  // Remove element
  remove: (element) => {
    if (typeof element === 'string') element = document.querySelector(element);
    element?.remove();
  },

  // Empty element (remove all children)
  empty: (element) => {
    if (typeof element === 'string') element = document.querySelector(element);
    if (element) element.innerHTML = '';
  },

  // Insert HTML before element
  insertBefore: (element, html) => {
    if (typeof element === 'string') element = document.querySelector(element);
    element?.insertAdjacentHTML('beforebegin', html);
  },

  // Insert HTML after element
  insertAfter: (element, html) => {
    if (typeof element === 'string') element = document.querySelector(element);
    element?.insertAdjacentHTML('afterend', html);
  },

  // Get parent element
  getParent: (element) => {
    if (typeof element === 'string') element = document.querySelector(element);
    return element?.parentElement || null;
  },

  // Get next sibling
  getNext: (element) => {
    if (typeof element === 'string') element = document.querySelector(element);
    return element?.nextElementSibling || null;
  },

  // Get previous sibling
  getPrev: (element) => {
    if (typeof element === 'string') element = document.querySelector(element);
    return element?.previousElementSibling || null;
  },

  // Check if element exists
  exists: (element) => {
    if (typeof element === 'string') element = document.querySelector(element);
    return element !== null;
  },

  // Scroll to element
  scrollTo: (element, smooth = true) => {
    if (typeof element === 'string') element = document.querySelector(element);
    element?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  },

  // Trigger element focus
  focus: (element) => {
    if (typeof element === 'string') element = document.querySelector(element);
    element?.focus();
  }
};
