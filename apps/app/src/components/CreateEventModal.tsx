import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import PosterUploaderDropzone from "./PosterUploader";
import TagSelector from "./common/TagSelector";

export type CreateEventPayload = {
    title: string;
    registrationDeadline: string; // yyyy-mm-dd
    eventDate: string; // yyyy-mm-dd
    tags: string[];
    poster: File | null;
};

type Props = {
    open: boolean;
    onClose: () => void;
    onCreate: (payload: CreateEventPayload) => void; // parent handles saving
    title?: string;
};

export default function CreateEventModal({
    open,
    onClose,
    onCreate,
    title = "Post an Event",
}: Props) {
    const ALL_TAGS = ["Tag 1", "Tag 2", "Tag 3", "Tag 4", "Tag 5", "Tag 6"];

    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [poster, setPoster] = useState<File | null>(null);
    const [eventTitle, setEventTitle] = useState<string>("");
    const [registrationDeadline, setRegistrationDeadline] = useState<string>("");
    const [eventDate, setEventDate] = useState<string>("");
    const [error, setError] = useState<string>("");

    // Close on ESC
    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    // Reset when modal closes
    useEffect(() => {
        if (open) return;
        setSelectedTags([]);
        setPoster(null);
        setEventTitle("");
        setRegistrationDeadline("");
        setEventDate("");
        setError("");
    }, [open]);

    const canSubmit = useMemo(() => {
        return (
            eventTitle.trim().length > 0 &&
            registrationDeadline.length > 0 &&
            eventDate.length > 0
        );
    }, [eventTitle, registrationDeadline, eventDate]);

    const submit = () => {
        setError("");

        if (!canSubmit) {
            setError("Please fill in title, registration deadline, and event date.");
            return;
        }

        onCreate({
            title: eventTitle.trim(),
            registrationDeadline,
            eventDate,
            tags: selectedTags,
            poster,
        });
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* overlay */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* modal */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div
                    role="dialog"
                    aria-modal="true"
                    className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="mb-4 flex items-start justify-between">
                        <h2 className="text-2xl font-semibold">{title}</h2>
                        <button
                            onClick={onClose}
                            className="rounded-lg p-2 hover:bg-stone-100 cursor-pointer"
                            aria-label="Close"
                            type="button"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <PosterUploaderDropzone value={poster} onChange={setPoster} />

                        <div>
                            <label className="text-sm font-medium">Event Title</label>
                            <input
                                value={eventTitle}
                                onChange={(e) => setEventTitle(e.target.value)}
                                className="mt-1 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-300"
                                placeholder="Enter title"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="text-sm font-medium">
                                    Registration deadline
                                </label>
                                <input
                                    value={registrationDeadline}
                                    onChange={(e) => setRegistrationDeadline(e.target.value)}
                                    type="date"
                                    className="mt-1 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-300"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Event date</label>
                                <input
                                    value={eventDate}
                                    onChange={(e) => setEventDate(e.target.value)}
                                    type="date"
                                    className="mt-1 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-300"
                                />
                            </div>
                        </div>

                        <TagSelector
                            tags={ALL_TAGS}
                            value={selectedTags}
                            onChange={setSelectedTags}
                            maxSelected={3}
                            label="Tags"
                        />

                        {error ? <p className="text-sm text-red-600">{error}</p> : null}

                        <button
                            type="button"
                            onClick={submit}
                            disabled={!canSubmit}
                            className={[
                                "mt-2 w-full rounded-xl px-4 py-3 text-sm font-semibold transition",
                                canSubmit
                                    ? "bg-(--accent) text-white hover:border hover:border-(--accent) hover:text-(--accent) cursor-pointer"
                                    : "bg-stone-200 text-stone-500 cursor-not-allowed",
                            ].join(" ")}
                        >
                            Pin to the Board
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}