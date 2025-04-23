import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SessionHandler = ({ userData, onLogout }) => {
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't check session on login page
    if (location.pathname === '/') {
      return;
    }

    // Check session status every 30 seconds
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:8000/reader/check-session', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          sessionStorage.clear(); 
          alert('Your session has expired. Please log in again.');
          onLogout();
        }
      } catch (error) {
        console.error('Session check failed:', error);
        sessionStorage.clear();
        alert('Session error. Please log in again.');
      
      }
    };

    const interval = setInterval(checkSession, 30000); // Check every 30 seconds

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [location.pathname, navigate]);

  return null; // This component doesn't render anything
};

export default SessionHandler; 