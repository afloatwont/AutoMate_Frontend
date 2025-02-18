import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './views/auth/Login';
import Signup from './views/auth/Signup';
import StudentDashboard from './views/dashboard/StudentDashboard';
import DriverDashboard from './views/dashboard/DriverDashboard';
import { ReactNode } from 'react';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  
  if (!token) {
    return <Navigate to="/" />;
  }

  if (userRole === 'student') {
    return <StudentDashboard />;
  } else if (userRole === 'driver') {
    return <DriverDashboard />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/dashboard/student" 
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/driver" 
          element={
            <ProtectedRoute>
              <DriverDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;