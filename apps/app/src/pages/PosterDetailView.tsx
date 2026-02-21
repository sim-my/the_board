// SimpleModal.jsx
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import AttendanceSelector, { type AttendanceStatus } from "../components/AttendanceSelector";


export default function PosterDetailView({ open, onClose, title = "Party at Paradise" }: {
    open: boolean;
    onClose: () => void;
    title?: string;
}) {

    const [myStatus, setMyStatus] = useState<AttendanceStatus>(null);

    // Close on ESC
    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e: any) => e.key === "Escape" && onClose?.();
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* overlay */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* modal */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div
                    role="dialog"
                    aria-modal="true"
                    className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="mb-4 flex items-start justify-between">
                        <h2 className="text-2xl font-semibold">{title}</h2>
                        <button
                            onClick={onClose}
                            className="rounded-lg p-2 hover:bg-stone-100 cursor-pointer"
                            aria-label="Close"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* content */}
                    <div className="space-y-4 flex items-col gap-8">
                        <img
                            src={"/sample_posters/poster_1.png"}
                            alt="Poster preview"
                            className="h-full w-80 rounded-lg object-cover border border-stone-200 bg-white"
                        />
                        <div className="">
                            <p className="text-stone-700">
                                <span className="font-semibold text-stone-900">Registration Deadline:</span>{" "}
                                01/01/2023
                            </p>

                            <p className="text-stone-700">
                                <span className="font-semibold text-stone-900">Event Date:</span>{" "}
                                01/01/2023
                            </p>

                            <AttendanceSelector
                                value={myStatus}
                                onChange={setMyStatus}
                                counts={{ going: 12, maybe: 5, not_going: 2 }}
                            />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}