import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppContext, errorMessage } from '../../context/AppContext';
import { currency, monthLabel } from '../../utils/format';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';
export default function Reminders() {
  const { data, month, api, save, busy } = useAppContext();
  const [params] = useSearchParams();
  const pending = data.students.filter((student) => !student.paid);
  const [studentId, setStudentId] = useState(Number(params.get('student')) || pending[0]?.id || 0),
    [language, setLanguage] = useState('English'),
    [tone, setTone] = useState('Polite'),
    [preview, setPreview] = useState(null),
    [generating, setGenerating] = useState(false);
  useEffect(() => {
    if (!pending.some((student) => student.id === studentId)) {
      setStudentId(pending[0]?.id || 0);
      setPreview(null);
    }
  }, [data.students, studentId]);
  const generate = async (event) => {
    event.preventDefault();
    setGenerating(true);
    try {
      const response = await api.post('/api/reminders', {
        student_id: studentId,
        language,
        tone,
        month,
      });
      setPreview({ ...response.data, studentId, month });
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setGenerating(false);
    }
  };
  const send = async () => {
    if (!preview) return;
    try {
      await save(
        () =>
          api.post('/api/notifications', {
            student_id: preview.studentId,
            message: preview.message,
          }),
        'Student notified',
      );
    } catch {}
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(preview.message);
      toast.success('Message copied');
    } catch {
      toast.error('Select the preview text and copy it manually.');
    }
  };
  return (
    <>
      <PageHeader
        title="AI payment reminders"
        description={`Thoughtful reminders for ${monthLabel(month)}, in your own tone.`}
      />
      {!pending.length ? (
        <section className="card">
          <EmptyState message="No pending fees this month. All caught up!" icon="check" />
        </section>
      ) : (
        <div className="reminder-grid">
          <section className="card">
            <h2>Personalise your message</h2>
            <p className="muted">Choose a student, language and tone.</p>
            <form onSubmit={generate}>
              <label htmlFor="recipient">Student</label>
              <select
                id="recipient"
                value={studentId}
                onChange={(event) => {
                  setStudentId(Number(event.target.value));
                  setPreview(null);
                }}
              >
                {pending.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} ·{' '}
                    {currency(data.classes.find((item) => item.id === student.class_id)?.fee)}
                  </option>
                ))}
              </select>
              <label htmlFor="language">Language</label>
              <select
                id="language"
                value={language}
                onChange={(event) => {
                  setLanguage(event.target.value);
                  setPreview(null);
                }}
              >
                <option>English</option>
                <option>Tamil</option>
              </select>
              <label htmlFor="tone">Tone</label>
              <select
                id="tone"
                value={tone}
                onChange={(event) => {
                  setTone(event.target.value);
                  setPreview(null);
                }}
              >
                <option>Polite</option>
                <option>Friendly</option>
                <option>Firm</option>
              </select>
              <button className="primary full-width" disabled={generating}>
                {generating ? 'Generating…' : '✧ Generate / regenerate'}
              </button>
            </form>
            <p className="demo-strip">
              Claude is optional. Without an API key, the server uses labelled templates.
            </p>
          </section>
          <section className="card">
            <div className="card-head">
              <h2>Message preview</h2>
              <span className="badge blue">
                {preview?.source === 'claude'
                  ? 'Claude AI'
                  : preview
                    ? 'Template'
                    : 'Ready when you are'}
              </span>
            </div>
            <div className="phone-preview">
              <div className="bubble">
                {preview?.message || 'Your payment reminder will appear here.'}
              </div>
              <p className="muted preview-time">TuitionPro · Just now</p>
            </div>
            <div className="preview-actions">
              <button disabled={!preview || preview.month !== month} onClick={copy}>
                Copy message
              </button>
              <button
                className="primary"
                disabled={!preview || busy || preview.month !== month}
                onClick={send}
              >
                Notify student
              </button>
            </div>
            <p className="muted section-action">
              Copy to WhatsApp manually. “Notify student” sends an in-app notification.
            </p>
          </section>
        </div>
      )}
    </>
  );
}
