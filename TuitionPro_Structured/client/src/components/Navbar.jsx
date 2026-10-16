import { Link } from 'react-router-dom';
import Logo from './Logo';
export default function Navbar() {
  return (
    <nav className="landing-nav">
      <Logo />
      <div className="landing-links">
        <a href="#features">Features</a>
        <a href="#workspaces">Workspaces</a>
        <a href="#how">How it works</a>
      </div>
      <Link className="landing-login" to="/login">
        Log in ↗
      </Link>
    </nav>
  );
}
