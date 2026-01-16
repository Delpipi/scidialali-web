// Loading animation
const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export function CardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-md bg-gray-100 p-2 shadow-sm`}
    >
      <div className="flex p-4">
        <div className="h-5 w-5 rounded-md bg-gray-200" />
        <div className="ml-2 h-6 w-16 rounded-md bg-gray-200 text-sm font-medium" />
      </div>
      <div className="flex items-center justify-center truncate rounded-md bg-white px-4 py-8">
        <div className="h-7 w-20 rounded-md bg-gray-200" />
      </div>
    </div>
  );
}

export function DashboardRentalRequestSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-md bg-gray-100 p-2 shadow-sm`}
    >
      <div className="flex p-4 items-center">
        <div className="h-5 w-5 rounded-md bg-gray-200" />
        <div className="ml-2 h-6 w-24 rounded-md bg-gray-200 text-sm font-medium" />
      </div>

      <div className="flex flex-col gap-2 truncate rounded-md bg-white px-4 py-6">
        <div className="h-4 w-32 rounded-md bg-gray-200" />

        <div className="h-4 w-48 rounded-md bg-gray-200" />
        <div className="mt-2 h-5 w-20 rounded-md bg-gray-200" />
      </div>
    </div>
  );
}

export function DashboardRentalRequestsSkeleton() {
  return (
    <>
      <DashboardRentalRequestSkeleton />
      <DashboardRentalRequestSkeleton />
      <DashboardRentalRequestSkeleton />
    </>
  );
}

export function CardsSkeleton() {
  return (
    <>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </>
  );
}

export default function DashboardSkeleton() {
  return (
    <>
      <div
        className={`${shimmer} relative mb-4 h-8 w-36 overflow-hidden rounded-md bg-gray-100`}
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </>
  );
}
