export function CalendarSkeleton() {
  return (
    <div className="grid grid-cols-7 gap-2 animate-pulse">
      {Array.from({ length: 35 }).map((_, i) => (
        <div key={i} className="min-h-30 border rounded-lg p-2 bg-gray-100">
          <div className="h-4 w-8 bg-gray-200 rounded mb-2" />{" "}
          <div className="space-y-1">
            <div className="h-6 w-full bg-gray-200 rounded" />{" "}
          </div>
        </div>
      ))}
    </div>
  );
}
