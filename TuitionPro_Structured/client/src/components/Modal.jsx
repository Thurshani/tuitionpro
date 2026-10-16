import { useEffect, useRef } from 'react';
import Icon from './Icon';
export default function Modal({ title, onClose, children }) {
  const dialog = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    dialog.current?.focus();
    const close = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab') {
        const items = dialog.current.querySelectorAll('button,input,select,textarea,a[href]');
        const first = items[0],
          last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('keydown', close);
      previous?.focus();
    };
  }, [onClose]);
  return (
    <div
      className="modal-back"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={dialog}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        <div className="card-head">
          <h2>{title}</h2>
          <button type="button" aria-label="Close dialog" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
