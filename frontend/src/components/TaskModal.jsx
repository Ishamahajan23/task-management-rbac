import { useEffect, useState } from 'react';

const TaskModal = ({ open, title, children, onClose }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!open) return;
    const resetTimer = setTimeout(() => setReady(false), 0);
    const readyTimer = setTimeout(() => setReady(true), 2000);
    return () => {
      clearTimeout(resetTimer);
      clearTimeout(readyTimer);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-2xl max-h-[92vh] rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200/60 overflow-hidden animate-scale-in flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 shrink-0">
          <div>
            <h2 id="task-modal-title" className="text-base font-semibold text-slate-900">{title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">Fast, elegant task management in one place.</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1 cursor-pointer"
            aria-label="Close modal"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-6">
          {!ready ? (
            <div className="space-y-5 animate-fade-in" aria-busy="true" aria-label="Loading form">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <span className="skeleton h-4 w-24 inline-block" />
                  <span className="skeleton h-11 w-full inline-block" />
                </div>
                <div className="space-y-2">
                  <span className="skeleton h-4 w-16 inline-block" />
                  <span className="skeleton h-11 w-full inline-block" />
                </div>
              </div>
              <div className="space-y-2">
                <span className="skeleton h-4 w-28 inline-block" />
                <span className="skeleton h-32 w-full inline-block" />
              </div>
              <div className="flex gap-3 justify-end pt-1">
                <span className="skeleton h-10 w-24 inline-block" />
                <span className="skeleton h-10 w-28 inline-block" />
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">{children}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
