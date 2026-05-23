// Form Validation Functions for SehatSetu

const Validation = {
  // Email validation
  isEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Phone number validation
  isPhone: (phone) => {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone);
  },

  // Password strength validation
  isStrongPassword: (password) => {
    return {
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*]/.test(password),
      isStrong: password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password)
    };
  },

  // Name validation
  isValidName: (name) => {
    const nameRegex = /^[a-zA-Z\s]{2,}$/;
    return nameRegex.test(name);
  },

  // Date validation
  isValidDate: (date) => {
    return !isNaN(Date.parse(date));
  },

  // URL validation
  isValidUrl: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Number validation
  isValidNumber: (num) => !isNaN(parseFloat(num)) && isFinite(num),

  // ZIP/Postal code validation
  isValidZipCode: (zip) => {
    const zipRegex = /^[0-9]{5,6}$/;
    return zipRegex.test(zip);
  },

  // Aadhar number validation
  isValidAadhar: (aadhar) => {
    const aadharRegex = /^[0-9]{12}$/;
    return aadharRegex.test(aadhar);
  },

  // PAN number validation
  isValidPan: (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  },

  // Indian mobile number validation
  isValidIndianMobile: (mobile) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  },

  // Credit card validation
  isValidCreditCard: (cardNumber) => {
    const cardRegex = /^[0-9]{13,19}$/;
    if (!cardRegex.test(cardNumber)) return false;
    
    // Luhn algorithm
    let sum = 0;
    let isEven = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i), 10);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    return sum % 10 === 0;
  },

  // Form validation helper
  validateForm: (formData, rules) => {
    const errors = {};
    for (const [field, rule] of Object.entries(rules)) {
      const value = formData[field];
      if (rule.required && !value) {
        errors[field] = `${field} is required`;
        continue;
      }
      if (rule.type === 'email' && !Validation.isEmail(value)) {
        errors[field] = `Invalid email format`;
      }
      if (rule.type === 'phone' && !Validation.isPhone(value)) {
        errors[field] = `Invalid phone number`;
      }
      if (rule.type === 'password' && !Validation.isStrongPassword(value).isStrong) {
        errors[field] = `Password must be strong`;
      }
      if (rule.minLength && value.length < rule.minLength) {
        errors[field] = `Minimum ${rule.minLength} characters required`;
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        errors[field] = `Maximum ${rule.maxLength} characters allowed`;
      }
      if (rule.pattern && !rule.pattern.test(value)) {
        errors[field] = `Invalid format`;
      }
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};
