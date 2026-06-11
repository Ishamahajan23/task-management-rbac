import { useEffect, useState } from 'react';

const FormShell = ({ children, className = '' }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 2000);
    return () => clearTimeout(t);
  }, []);

  if (!ready) {
    return (
      <div className={`w-full space-y-6 animate-fade-in ${className}`} aria-busy="true" aria-label="Loading form">
        <div className="grid gap-6 md:grid-cols-2">
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
        <div className="flex gap-3 justify-end pt-2">
          <span className="skeleton h-10 w-24 inline-block" />
          <span className="skeleton h-10 w-28 inline-block" />
        </div>
      </div>
    );
  }

  return <div className={`animate-fade-in ${className}`}>{children}</div>;
};

export default FormShell;
