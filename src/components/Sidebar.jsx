import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaPen, FaCommentDots, FaSignOutAlt } from 'react-icons/fa';
import './Sidebar.css';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Blog App</h2>
      <nav className="menu">
        <Link 
          to="/posts"
          className={location.pathname === '/posts' ? 'active' : ''}
        >
          <FaHome className="icon" /> Posts
        </Link>
        
        
      </nav>
      <div className="logout-section">
        <button onClick={handleLogout}>
          <FaSignOutAlt className="icon" /> Sign Out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
