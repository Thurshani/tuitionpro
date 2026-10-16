import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppContext, errorMessage } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import Icon from '../components/Icon';
export default function Materials() {
  const { user, data, api, save, busy } = useAppContext();
  const [filter, setFilter] = useState('all'),
    [open, setOpen] = useState(false),
    [video, setVideo] = useState(null);
  const rows = data.materials.filter(
    (item) => filter === 'all' || item.class_id === Number(filter),
  );
  const canManage = user.role !== 'student';
  const upload = async (event) => {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    try {
      await save(() => api.post('/api/materials', fields), 'Material uploaded');
      setOpen(false);
    } catch {}
  };
  const remove = async (item) => {
    if (!window.confirm(`Delete “${item.name}”?`)) return;
    try {
      await save(() => api.delete(`/api/materials/${item.id}`), 'Material deleted');
    } catch {}
  };
  const openFile = async (item) => {
    try {
      const response = await api.get(`/api/materials/${item.id}/file`, { responseType: 'blob' });
      const url = URL.createObjectURL(response.data);
      if (item.type === 'Video') setVideo({ title: item.name, url });
      else {
        const link = document.createElement('a');
        link.href = url;
        link.download = item.original_name;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 10000);
      }
    } catch (error) {
      toast.error(
        error.response?.status === 403
          ? 'This resource is not available to your account'
          : errorMessage(error),
      );
    }
  };
  const closeVideo = () => {
    URL.revokeObjectURL(video.url);
    setVideo(null);
  };
  return (
    <>
      <PageHeader
        title="Notes & video library"
        description="Class resources, organised and ready to share."
      >
        {canManage && (
          <button className="primary" disabled={!data.classes.length} onClick={() => setOpen(true)}>
            + Upload material
          </button>
        )}
      </PageHeader>
      <section className="card">
        <div className="card-head">
          <h2>Resource library · {rows.length} items</h2>
          <select
            aria-label="Filter resources by class"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="all">All my classes</option>
            {data.classes.map((item) => (
              <option value={item.id} key={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="resource-grid">
          {rows.map((item) => (
            <article className="resource-card" key={item.id}>
              <div className={`resource-cover ${item.type === 'Video' ? 'video-cover' : ''}`}>
                <Icon name={item.type === 'Video' ? 'play' : 'materials'} size={38} />
                <small>{item.type === 'Video' ? 'RECORDED LESSON' : 'CLASS NOTES'}</small>
              </div>
              <div className="resource-info">
                <span className="badge blue">{item.type}</span>
                <h3>{item.name}</h3>
                <p>{data.classes.find((cls) => cls.id === item.class_id)?.name}</p>
                <small className="muted">
                  Shared {new Date(item.created_at).toLocaleDateString('en-GB')}
                </small>
                <div className="resource-actions">
                  <button onClick={() => openFile(item)}>
                    {item.type === 'Video' ? '▷ Watch lesson' : '↓ Download'}
                  </button>
                  {canManage && (
                    <button
                      aria-label={`Delete ${item.name}`}
                      disabled={busy}
                      onClick={() => remove(item)}
                    >
                      <Icon name="delete" size={14} />
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
        {!rows.length && <EmptyState message="No resources for this class yet." />}
      </section>
      {open && (
        <Modal title="Upload learning material" onClose={() => setOpen(false)}>
          <form onSubmit={upload}>
            <label htmlFor="material-name">Title</label>
            <input id="material-name" name="name" required maxLength={150} />
            <label htmlFor="material-class">Class</label>
            <select id="material-class" name="class_id" required>
              {data.classes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <label htmlFor="material-file">PDF / MP4 / WebM · max 100 MB</label>
            <input id="material-file" name="file" type="file" accept=".pdf,.mp4,.webm" required />
            <button className="primary" disabled={busy}>
              {busy ? 'Uploading…' : 'Upload resource'}
            </button>
          </form>
        </Modal>
      )}
      {video && (
        <Modal title={video.title} onClose={closeVideo}>
          <video controls className="resource-video" src={video.url} />
        </Modal>
      )}
    </>
  );
}
