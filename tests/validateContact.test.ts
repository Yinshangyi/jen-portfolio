import { describe, it, expect } from 'vitest';
import { validateContact } from '../src/lib/validateContact';

describe('validateContact', () => {
  it('passes with a valid name, email, and message', () => {
    const result = validateContact({ name: 'Jane', email: 'jane@example.com', message: 'Hello there' });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });
  it('flags a missing name', () => {
    const result = validateContact({ name: '  ', email: 'jane@example.com', message: 'Hi' });
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeTruthy();
  });
  it('flags an invalid email', () => {
    const result = validateContact({ name: 'Jane', email: 'not-an-email', message: 'Hi' });
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeTruthy();
  });
  it('flags an empty message', () => {
    const result = validateContact({ name: 'Jane', email: 'jane@example.com', message: '' });
    expect(result.valid).toBe(false);
    expect(result.errors.message).toBeTruthy();
  });
});
