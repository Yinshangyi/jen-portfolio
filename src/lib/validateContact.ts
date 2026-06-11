export interface ContactInput {
  name: string;
  email: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContactInput, string>>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(input: ContactInput): ValidationResult {
  const errors: ValidationResult['errors'] = {};
  if (!input.name || !input.name.trim()) errors.name = 'Please enter your name.';
  if (!EMAIL_RE.test(input.email.trim())) errors.email = 'Please enter a valid email.';
  if (!input.message || !input.message.trim()) errors.message = 'Please enter a message.';
  return { valid: Object.keys(errors).length === 0, errors };
}
