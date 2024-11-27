import { validate } from 'class-validator';
import { SignupInput } from './signup-input.dto';

describe('SignupInput', () => {
  it('should validate passwords with each allowed special character', async () => {
    const specialCharacters = '!@#$%^&*()_+[]{}|;:\'",.<>?/`~';
    for (const char of specialCharacters) {
      const signupInput = new SignupInput();
      signupInput.email = 'test@example.com';
      signupInput.password = `Password1${char}`;

      const errors = await validate(signupInput);
      expect(errors.length).toBe(0);
    }
  });

  it('should invalidate passwords without special characters', async () => {
    const signupInput = new SignupInput();
    signupInput.email = 'test@example.com';
    signupInput.password = 'Password1';

    const errors = await validate(signupInput);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('matches');
  });

  it('should invalidate passwords without numbers', async () => {
    const signupInput = new SignupInput();
    signupInput.email = 'test@example.com';
    signupInput.password = 'Password!';

    const errors = await validate(signupInput);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('matches');
  });

  it('should invalidate passwords without letters', async () => {
    const signupInput = new SignupInput();
    signupInput.email = 'test@example.com';
    signupInput.password = '12345678!';

    const errors = await validate(signupInput);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('matches');
  });

  it('should invalidate passwords shorter than 8 characters', async () => {
    const signupInput = new SignupInput();
    signupInput.email = 'test@example.com';
    signupInput.password = 'P1@';

    const errors = await validate(signupInput);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('minLength');
  });

  it('should validate a correct password', async () => {
    const signupInput = new SignupInput();
    signupInput.email = 'test@example.com';
    signupInput.password = 'Password1@';

    const errors = await validate(signupInput);
    expect(errors.length).toBe(0);
  });
});