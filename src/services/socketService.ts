import { io, Socket } from 'socket.io-client';
import { logger } from './logger';

class SocketService {
  private socket: Socket | null = null;
  private readonly API_URL = 'https://automate-brq0.onrender.com';

  connect() {
    if (!this.socket) {
      const token = localStorage.getItem('token');
      
      this.socket = io(this.API_URL, {
        withCredentials: true,
        auth: { token },
        extraHeaders: {
          'Authorization': `Bearer ${token}`
        }
      });

      this.socket.on('connect', () => {
        logger.info('Socket connected successfully');
      });

      this.socket.on('connect_error', (error) => {
        logger.error('Socket connection error:', error);
      });

      this.socket.on('error', (error) => {
        logger.error('Socket error:', error);
      });
    }
    return this.socket;
  }

  getSocket() {
    if (!this.socket?.connected) {
      return this.connect();
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket?.connected) {
      this.socket.disconnect();
      this.socket = null;
      logger.info('Socket disconnected');
    }
  }
}

export const socketService = new SocketService();