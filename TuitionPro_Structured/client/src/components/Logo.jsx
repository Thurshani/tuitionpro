import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
export default function Logo() {
  return (
    <Link to="/" className="brand">
      <img className="brand-mark" src={logo} alt="TuitionPro book and graduation cap" />
      Tuition<span>Pro</span>
    </Link>
  );
}
