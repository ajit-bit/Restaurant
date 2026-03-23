"use client";

export default function DateRangePicker(props: {
  startDate: string;
  endDate: string;
  onChange: (next: { startDate: string; endDate: string }) => void;
}) {
  const { startDate, endDate, onChange } = props;

  return (
    <div className="flex flex-col sm:flex-row gap-3 bg-white/70 dark:bg-black/50 border border-black/10 rounded-sm p-4">
      <label className="flex flex-col gap-1 flex-1">
        <span className="text-sm">Start date</span>
        <input
          type="date"
          className="border border-black/10 rounded-sm px-3 py-2"
          value={startDate}
          onChange={(e) => onChange({ startDate: e.target.value, endDate })}
        />
      </label>
      <label className="flex flex-col gap-1 flex-1">
        <span className="text-sm">End date</span>
        <input
          type="date"
          className="border border-black/10 rounded-sm px-3 py-2"
          value={endDate}
          onChange={(e) =>
            onChange({ startDate, endDate: e.target.value })
          }
        />
      </label>
    </div>
  );
}

