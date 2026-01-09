import { Loader2 } from "lucide-react";

export default function ListLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-20 w-full">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="mt-4 text-gray-500 animate-pulse">
        Chargement des biens...
      </p>
    </div>
  );
}
