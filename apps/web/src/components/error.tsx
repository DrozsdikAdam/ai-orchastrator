export const ErrorDisplay = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center gap-2">
        <p className="text-lg font-medium">Hiba történt</p>
        <p>{message}</p>
    </div>
)