import Button from './Button';
import { TASK_STATUS } from '../utils/constants';

const inputBase =
  'w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100';

const TaskForm = ({ mode, formData, onChange, onSubmit, onCancel, loading, error }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700" htmlFor="task-title">
            Task title <span className="text-red-500">*</span>
          </label>
          <input
            id="task-title"
            type="text"
            name="title"
            value={formData.title}
            onChange={onChange}
            required
            className={inputBase}
            placeholder="Write a concise title"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700" htmlFor="task-status">
            Status
          </label>
          <select
            id="task-status"
            name="status"
            value={formData.status}
            onChange={onChange}
            className={inputBase}
          >
            <option value={TASK_STATUS.PENDING}>{TASK_STATUS.PENDING}</option>
            <option value={TASK_STATUS.COMPLETED}>{TASK_STATUS.COMPLETED}</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700" htmlFor="task-description">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="task-description"
          name="description"
          value={formData.description}
          onChange={onChange}
          rows="6"
          required
          className={`${inputBase} resize-none`}
          placeholder="Share the details of the task"
        />
      </div>

      <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
        <Button
          type="button"
          className="bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer shadow-sm shadow-emerald-200"
          loading={loading}
          disabled={loading}
        >
          {loading ? `${mode}ing…` : mode}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
