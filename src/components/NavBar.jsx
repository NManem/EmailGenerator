import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/edit">Edit Email</Link></li>
        <li><Link to="/email">Email Display</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;