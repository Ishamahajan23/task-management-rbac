import Button from './Button';
import { TASK_STATUS } from '../utils/constants';

const TaskForm = ({ mode, formData, onChange, onSubmit, onCancel, loading, error }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Task title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onChange}
            required
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            placeholder="Write a concise title"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={onChange}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          >
            <option value={TASK_STATUS.PENDING}>{TASK_STATUS.PENDING}</option>
            <option value={TASK_STATUS.COMPLETED}>{TASK_STATUS.COMPLETED}</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onChange}
          rows="6"
          required
          className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          placeholder="Share the details of the task"
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
        <Button type="button" className="bg-slate-200 text-slate-800 hover:bg-slate-300 cursor-pointer" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer" loading={loading} disabled={loading}>
          {loading ? `${mode}ing…` : mode}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
