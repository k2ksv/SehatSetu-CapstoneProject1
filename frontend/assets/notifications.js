// Notification System for SehatSetu

const Notifications = {
  // Default notification styles
  styles: {
    success: { bgColor: '#10b981', textColor: '#fff', icon: '✓' },
    error: { bgColor: '#ef4444', textColor: '#fff', icon: '✕' },
    warning: { bgColor: '#f59e0b', textColor: '#fff', icon: '⚠' },
    info: { bgColor: '#3b82f6', textColor: '#fff', icon: 'ℹ' }
  },

  // Toast notification
  toast: (message, type = 'info', duration = 3000) => {
    const style = Notifications.styles[type] || Notifications.styles.info;
    
    const toastContainer = document.getElementById('toast-container') || Notifications.createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `notification-toast notification-${type}`;
    toast.style.cssText = `
      background-color: ${style.bgColor};
      color: ${style.textColor};
      padding: 12px 16px;
      margin-bottom: 10px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 10px;
      animation: slideIn 0.3s ease;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      font-size: 14px;
    `;

    const icon = document.createElement('span');
    icon.textContent = style.icon;
    icon.style.fontWeight = 'bold';
    
    const text = document.createElement('span');
    text.textContent = message;
    
    toast.appendChild(icon);
    toast.appendChild(text);
    toastContainer.appendChild(toast);

    // Auto remove after duration
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);

    return toast;
  },

  // Alert notification
  alert: (message, title = 'Alert') => {
    return new Promise((resolve) => {
      const modal = Notifications.createModal(title, message, [
        { text: 'OK', callback: () => { resolve(true); } }
      ]);
      modal.show();
    });
  },

  // Confirm notification
  confirm: (message, title = 'Confirm') => {
    return new Promise((resolve) => {
      const modal = Notifications.createModal(title, message, [
        { text: 'Cancel', callback: () => { resolve(false); } },
        { text: 'OK', callback: () => { resolve(true); } }
      ]);
      modal.show();
    });
  },

  // Prompt notification
  prompt: (message, title = 'Prompt', defaultValue = '') => {
    return new Promise((resolve) => {
      const modal = Notifications.createPromptModal(title, message, defaultValue, [
        { text: 'Cancel', callback: () => { resolve(null); } },
        { text: 'OK', callback: (value) => { resolve(value); } }
      ]);
      modal.show();
    });
  },

  // Create toast container
  createToastContainer: () => {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      max-width: 400px;
    `;
    document.body.appendChild(container);
    return container;
  },

  // Create modal
  createModal: (title, message, buttons = []) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;

    const modal = document.createElement('div');
    modal.style.cssText = `
      background: white;
      border-radius: 8px;
      padding: 20px;
      max-width: 400px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      animation: scaleIn 0.3s ease;
    `;

    const titleElement = document.createElement('h2');
    titleElement.textContent = title;
    titleElement.style.cssText = 'margin: 0 0 12px 0; font-size: 18px; color: #333;';
    modal.appendChild(titleElement);

    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageElement.style.cssText = 'margin: 0 0 20px 0; color: #666; line-height: 1.5;';
    modal.appendChild(messageElement);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = 'display: flex; gap: 10px; justify-content: flex-end;';
    
    buttons.forEach(btn => {
      const button = document.createElement('button');
      button.textContent = btn.text;
      button.style.cssText = `
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background: #3b82f6;
        color: white;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.2s;
      `;
      button.onmouseover = () => button.style.background = '#2563eb';
      button.onmouseout = () => button.style.background = '#3b82f6';
      button.onclick = () => {
        btn.callback();
        overlay.remove();
      };
      buttonsContainer.appendChild(button);
    });

    modal.appendChild(buttonsContainer);
    overlay.appendChild(modal);

    return {
      show: () => document.body.appendChild(overlay),
      hide: () => overlay.remove()
    };
  },

  // Create prompt modal
  createPromptModal: (title, message, defaultValue, buttons) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;

    const modal = document.createElement('div');
    modal.style.cssText = `
      background: white;
      border-radius: 8px;
      padding: 20px;
      max-width: 400px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
    `;

    const titleElement = document.createElement('h2');
    titleElement.textContent = title;
    titleElement.style.cssText = 'margin: 0 0 12px 0; font-size: 18px; color: #333;';
    modal.appendChild(titleElement);

    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageElement.style.cssText = 'margin: 0 0 12px 0; color: #666;';
    modal.appendChild(messageElement);

    const input = document.createElement('input');
    input.type = 'text';
    input.value = defaultValue;
    input.style.cssText = `
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      margin-bottom: 20px;
      box-sizing: border-box;
    `;
    modal.appendChild(input);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = 'display: flex; gap: 10px; justify-content: flex-end;';
    
    buttons.forEach(btn => {
      const button = document.createElement('button');
      button.textContent = btn.text;
      button.style.cssText = `
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background: #3b82f6;
        color: white;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.2s;
      `;
      button.onmouseover = () => button.style.background = '#2563eb';
      button.onmouseout = () => button.style.background = '#3b82f6';
      button.onclick = () => {
        btn.callback(input.value);
        overlay.remove();
      };
      buttonsContainer.appendChild(button);
    });

    modal.appendChild(buttonsContainer);
    overlay.appendChild(modal);

    return {
      show: () => { document.body.appendChild(overlay); input.focus(); },
      hide: () => overlay.remove()
    };
  },

  // Add CSS animations
  injectStyles: () => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
      @keyframes scaleIn {
        from {
          transform: scale(0.9);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }
};

// Inject styles on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Notifications.injectStyles());
} else {
  Notifications.injectStyles();
}
