import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Icon from '../components/Icon';
const features = [
  [
    'classes',
    'Organised classes',
    'Manage your class schedules, teacher assignments and student records.',
  ],
  [
    'attendance',
    'Every session counts',
    'Mark attendance and follow progress with date-wise history.',
  ],
  ['payments', 'Clear monthly fees', 'Track collected fees and pending payments in one place.'],
  [
    'materials',
    'Resources, ready to learn',
    'Share PDF notes, worksheets and recorded video lessons.',
  ],
  [
    'reminders',
    'The right words',
    'Payment reminders in English or Tamil, with a tone you choose.',
  ],
  [
    'students',
    'Connected workspaces',
    'Give admin, teachers and students a clear view of their work.',
  ],
];
const workspaces = [
  [
    'admin',
    'For management',
    'Keep your institute moving.',
    'Register teachers, create classes and keep everyone organised.',
  ],
  [
    'teacher',
    'For teachers',
    'Focus on your students.',
    'Manage attendance, fees, materials and thoughtful reminders.',
  ],
  [
    'student',
    'For students',
    'Stay on top of your learning.',
    'Find your class updates, attendance, fees and study resources.',
  ],
];
export default function Home() {
  return (
    <div className="landing">
      <Navbar />
      <section className="landing-hero">
        <div className="hero-orbit" />
        <div className="landing-copy">
          <div className="landing-kicker">
            <span />
            BUILT FOR YOUR TUITION CLASSROOM
          </div>
          <h1>
            Less admin.
            <br />
            More <em>learning.</em>
          </h1>
          <p>
            From the first roll call to the last fee reminder. Bring your teachers, students and
            classes together in one simple workspace.
          </p>
          <div className="landing-ctas">
            <Link className="primary button-link" to="/login?role=admin">
              Get started <Icon name="arrow" />
            </Link>
            <a href="#workspaces">Find your workspace ↗</a>
          </div>
          <div className="hero-caption">
            <div className="tiny-avatars">
              <span>A</span>
              <span>T</span>
              <span>S</span>
            </div>
            <div>
              One institute. Three connected workspaces.
              <br />
              <small>Admin · Teacher · Student</small>
            </div>
          </div>
        </div>
      </section>
      <div className="landing-ribbon">
        {['CLASS MANAGEMENT', 'ATTENDANCE', 'FEE TRACKING', 'MATERIALS', 'AI REMINDERS'].map(
          (text) => (
            <span key={text}>{text}</span>
          ),
        )}
      </div>
      <section className="landing-section" id="features">
        <div className="section-heading">
          <div>
            <div className="landing-kicker">THE EVERYDAY, MADE EASIER</div>
            <h2>
              Everything your institute needs.
              <br />
              Right where you need it.
            </h2>
          </div>
          <p>Simple tools that work together, so you can spend more time on your students.</p>
        </div>
        <div className="feature-grid">
          {features.map(([icon, title, description], index) => (
            <article className="feature-card" key={title}>
              <div className={`feature-icon ${['blue', 'mint', 'peach', 'lilac'][index % 4]}`}>
                <Icon name={icon} size={24} />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="workspace-section" id="workspaces">
        <div className="landing-kicker">CONNECTED, WITH CLEAR ROLES</div>
        <h2>Your role. Your workspace.</h2>
        <p>Select your account type to sign in.</p>
        <div className="workspace-cards">
          {workspaces.map(([role, label, title, description], index) => (
            <article key={role}>
              <span className="workspace-number">0{index + 1}</span>
              <small>{label}</small>
              <h3>{title}</h3>
              <p>{description}</p>
              <Link className="workspace-login" to={`/login?role=${role}`}>
                {role[0].toUpperCase() + role.slice(1)} login <Icon name="arrow" />
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="landing-section" id="how">
        <div className="landing-kicker">A SIMPLE START</div>
        <h2>From setup to class time.</h2>
        <div className="how-grid">
          {[
            ['Set up your institute', 'Admin registers teachers and assigns classes.'],
            ['Manage the everyday', 'Teachers record attendance, fees and resources.'],
            ['Keep everyone connected', 'Students access their learning and class updates.'],
          ].map(([title, description], index) => (
            <div key={title}>
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
