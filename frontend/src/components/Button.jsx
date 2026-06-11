const BASE =
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium text-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none';

const VARIANTS = {
  primary: {
    className: 'px-4 py-2.5 text-white font-semibold shadow-[0_2px_12px_rgba(22,145,121,0.35)] hover:shadow-[0_4px_18px_rgba(22,145,121,0.45)] hover:brightness-[1.06]',
    style: { background: 'linear-gradient(135deg, #5FB56A 0%, #169179 100%)' },
  },
  secondary: {
    className: 'px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm',
    style: {},
  },
  ghost: {
    className: 'px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    style: {},
  },
  danger: {
    className: 'px-4 py-2.5 bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-200',
    style: {},
  },
};

const Button = ({ children, className = '', loading = false, variant, style: extraStyle, ...props }) => {
  const v = variant ? VARIANTS[variant] : null;

  return (
    <button
      {...props}
      style={v?.style ? { ...v.style, ...extraStyle } : extraStyle}
      className={`${BASE} ${v ? v.className : 'px-4 py-2.5'} ${className}`}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      <span>{children}</span>
    </button>
  );
};

export default Button;
