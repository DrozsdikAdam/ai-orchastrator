import { Loader2 } from "lucide-react";

export const Loader = () => (
    <div className="flex flex-col items-center gap-2">
        <Loader2 size={40} className="animate-spin text-primary" />
        <p className="text-sm">Betöltés...</p>
    </div>
)