import axios from 'axios';
import { LoginFormData, SignupFormData, AuthResponse } from '../models/types';

export const API_URL = 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  async signup(data: SignupFormData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(data)
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Signup failed');
      }

      return responseData;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  async login(data: LoginFormData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(data)
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Login failed');
      }

      return responseData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
};