import { NavLink } from 'react-router-dom';
import '../styles/BottomNav.css';

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/dashboard" className="nav-item">
        <span className="nav-label">Home</span>
      </NavLink>

      <NavLink to="/tracking" className="nav-item">
        <span className="nav-label">Tracking</span>
      </NavLink>

      <NavLink to="/calendar" className="nav-item">
        <span className="nav-label">Calendar</span>
      </NavLink>

      <NavLink to="/calculator" className="nav-item">
        <span className="nav-label">Calculator</span>
      </NavLink>

      <NavLink to="/wishlist" className="nav-item">
        <span className="nav-label">Wishlist</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
