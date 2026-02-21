import { useEffect, useState } from "react";
import { X } from "lucide-react";
import AttendanceSelector, { type AttendanceStatus } from "../components/AttendanceSelector";
import type { EventItem } from "../App";

type Props = {
    event: EventItem;
    onClose: () => void;
};

export default function PosterDetailView({ event, onClose }: Props) {
    const [myStatus, setMyStatus] = useState<AttendanceStatus>(null);

    // Close on ESC
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50">
            {/* overlay */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* modal */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div
                    role="dialog"
                    aria-modal="true"
                    className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="mb-4 flex items-start justify-between">
                        <h2 className="text-2xl font-semibold">{event.title}</h2>
                        <button
                            onClick={onClose}
                            className="rounded-lg p-2 hover:bg-stone-100 cursor-pointer"
                            aria-label="Close"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* content */}
                    <div className="flex flex-col md:flex-row gap-8">
                        <img
                            src={event.posterUrl}
                            alt={event.title}
                            className="w-full md:w-80 rounded-lg object-cover border border-stone-200"
                        />

                        <div className="space-y-3">
                            <p className="text-stone-700">
                                <span className="font-semibold text-stone-900">
                                    Registration Deadline:
                                </span>{" "}
                                {event.registrationDeadline}
                            </p>

                            <p className="text-stone-700">
                                <span className="font-semibold text-stone-900">Event Date:</span>{" "}
                                {event.eventDate}
                            </p>

                            <AttendanceSelector
                                value={myStatus}
                                onChange={setMyStatus}
                                counts={event.counts}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}