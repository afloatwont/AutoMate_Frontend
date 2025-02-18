import { LoginFormData, SignupFormData, AuthResponse } from '../models/types';
import { authService } from '../services/api';
import { logger } from '../services/logger';

export class AuthController {
  static async login(data: LoginFormData): Promise<void> {
    try {
      const response = await authService.login(data);
      this.handleAuthResponse(response);
    } catch (error) {
      logger.error('Login failed:', error);
      throw error;
    }
  }

  static async signup(data: SignupFormData): Promise<void> {
    try {
      if (!this.validatePassword(data.password)) {
        throw new Error('Password must be at least 6 characters long');
      }
      const response = await authService.signup(data);
      this.handleAuthResponse(response);
    } catch (error) {
      logger.error('Signup failed:', error);
      throw error;
    }
  }

  private static handleAuthResponse(response: AuthResponse): void {
    if (response.user && response.user.role) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('userRole', response.user.role);
      logger.info('Authentication successful');
    } else {
      logger.error('User object or role is missing in AuthResponse');
      // Handle the error appropriately, e.g., redirect to an error page or display an error message
    }
  }

  private static validatePassword(password: string): boolean {
    return password.length >= 6;
  }
}