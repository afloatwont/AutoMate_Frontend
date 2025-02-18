import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthController } from '../../controllers/authController';
import { SignupFormData } from '../../models/types';
import '../../styles/auth/signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    role: 'student',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      setLoading(true);
      if (!validatePassword(formData.password)) {
        throw new Error('Password must be at least 6 characters long');
      }
      if (!formData.name) {
        throw new Error('Name is required');
      }
      await AuthController.signup(formData);
      const userRole = localStorage.getItem('userRole');
      navigate(userRole === 'student' ? '/dashboard/student' : '/dashboard/driver');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setError('');
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="input-field"
          disabled={loading}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="input-field"
          disabled={loading}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="input-field"
          disabled={loading}
          required
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="role"
          disabled={loading}
        >
          <option value="student">Student</option>
          <option value="driver">Auto Driver</option>
        </select>
        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      <p className="login-link">
        Already have an account? 
        <button 
          onClick={() => navigate('/')} 
          className="link-button"
          disabled={loading}
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default Signup;