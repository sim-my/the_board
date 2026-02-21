import React from "react";
import { CalendarSearch } from "lucide-react";

type InitialViewProps = {
    onContinue?: () => void;
};

export default function InitialView({ onContinue }: InitialViewProps) {
    return (
        <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center gap-5">
            <CalendarSearch className="h-24 w-24 text-[var(--accent-light)]" />

            <div className="flex flex-col items-center justify-center gap-2">
                <p className="text-2xl font-semibold text-stone-500">No events found!</p>
                <p className="text-sm text-stone-400">Create your first event to get started.</p>
            </div>

            {onContinue ? (
                <button
                    type="button"
                    onClick={onContinue}
                    className="rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white hover:opacity-90 cursor-pointer"
                >
                    Go to Board
                </button>
            ) : null}
        </div>
    );
}