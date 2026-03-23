"use client";

export default function DateRangePicker(props: {
  startDate: string;
  endDate: string;
  onChange: (next: { startDate: string; endDate: string }) => void;
}) {
  const { startDate, endDate, onChange } = props;

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        📅 Date Range Selection
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            🗓️ Start Date
          </span>
          <input
            type="date"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-600 dark:text-white transition-all"
            value={startDate}
            onChange={(e) => onChange({ startDate: e.target.value, endDate })}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            🗓️ End Date
          </span>
          <input
            type="date"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-600 dark:text-white transition-all"
            value={endDate}
            onChange={(e) =>
              onChange({ startDate, endDate: e.target.value })
            }
          />
        </label>
      </div>
    </div>
  );
}

