import { useEffect, useState } from 'react';

const TaskModal = ({ open, title, children, onClose }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!open) return;
    setReady(false);
    const timer = setTimeout(() => setReady(true), 2000);
    return () => clearTimeout(timer);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] rounded-[32px] border border-slate-200 bg-white shadow-2xl overflow-hidden">     
          <div className="flex items-center justify-between bg-emerald-600 px-8 py-6">
          <div>
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <p className="text-sm text-emerald-100 mt-1">Fast, elegant task management in one place.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 cursor-pointer"
            aria-label="Close task form"
          >
            ✕
          </button>
        </div>

        <div className="max-h-[calc(90vh-100px)] overflow-y-auto p-8">
              {!ready ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-slate-600">
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg className="animate-spin h-8 w-8 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              </div>
              <p className="text-base font-medium">Opening task form…</p>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
