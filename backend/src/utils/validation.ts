import validator from 'validator';

export const validateEmail = (email: string): boolean => {
  return validator.isEmail(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
};

export const validatePhone = (phone: string): boolean => {
  return validator.isMobilePhone(phone);
};

export const sanitizeInput = (input: string): string => {
  return validator.escape(input.trim());
};

export const validateURL = (url: string): boolean => {
  return validator.isURL(url);
};

export const validateZipCode = (zipCode: string): boolean => {
  return /^\d{5}(?:-\d{4})?$/.test(zipCode);
};
