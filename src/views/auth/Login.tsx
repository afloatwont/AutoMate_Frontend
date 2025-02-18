import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthController } from '../../controllers/authController';
import { LoginFormData } from '../../models/types';
import '../../styles/auth/login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      setLoading(true);
      await AuthController.login(formData);
      const userRole = localStorage.getItem('userRole');
      navigate(userRole === 'student' ? '/dashboard/student' : '/dashboard/driver');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="input-field"
          disabled={loading}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="input-field"
          disabled={loading}
        />
        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="signup-link">
        Don't have an account? 
        <button 
          onClick={() => navigate('/signup')} 
          className="link-button"
          disabled={loading}
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default Login;