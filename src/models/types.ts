export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  role: 'student' | 'driver';
  name: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface QueueItem {
  id: string;
  studentName: string;
  timestamp: string;
  status: 'waiting' | 'accepted' | 'rejected';
  position?: number; // Add position from QueueDetail
}

export interface QueueState {
  items: QueueItem[];
  isInQueue: boolean;
  currentPosition?: number; // Add current user's position
}

export interface QueueData {
  queue: Array<User>;
  length: number;
  queueDetails: Array<QueueDetail>;
}

export interface QueueDetail {
  user: {
    email: string;
    name: string;
    role: string;
    status?: 'waiting' | 'accepted' | 'rejected';
  };
  position: number;
}

interface User {
  _id: string;
  email: string;
  password: string;
  name: string;
  role: 'student' | 'driver';
}