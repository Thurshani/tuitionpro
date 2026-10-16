import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppContext, errorMessage } from '../context/AppContext';
import Logo from '../components/Logo';
export default function Login() {
  const [params, setParams] = useSearchParams();
  const requested = params.get('role');
  const role = ['admin', 'teacher', 'student'].includes(requested) ? requested : 'student';
  const { login } = useAppContext();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    setBusy(true);
    try {
      const user = await login(fields.get('email'), fields.get('password'), role);
      navigate(`/${user.role}`);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="login">
      <section className="login-art">
        <Logo />
        <div>
          <div className="eyebrow">LESS ADMIN. MORE POSSIBILITY.</div>
          <h1>
            A better day
            <br />
            in your classroom.
          </h1>
          <p>Your classes, students and learning. One calm place to keep everything moving.</p>
        </div>
        <span className="muted">Your classroom. A little more organised.</span>
      </section>
      <section className="login-form">
        <div className="login-box">
          <Link className="back-home" to="/">
            ← Back to home
          </Link>
          <div className="eyebrow">WELCOME TO TUITIONPRO</div>
          <h1>Good to see you.</h1>
          <p className="muted">Choose your role and sign in.</p>
          <div className="role-tabs">
            {['admin', 'teacher', 'student'].map((item) => (
              <button
                key={item}
                className={role === item ? 'selected' : ''}
                onClick={() => setParams({ role: item })}
              >
                {item[0].toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
          <form key={role} onSubmit={submit}>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              placeholder={`${role}@tuitionpro.local`}
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
            <button className="primary full-width" disabled={busy}>
              {busy ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>
          <p className="muted">Your institute provides your login details.</p>
        </div>
      </section>
    </div>
  );
}
