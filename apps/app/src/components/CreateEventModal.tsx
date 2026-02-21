// SimpleModal.jsx
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import TagSelector from "./common/TagSelector";
import PosterUploaderDropzone from "./PosterUploader";

export default function CreateEventModal({ open, onClose, title = "Post an Event" }: {
    open: boolean;
    onClose: () => void;
    title?: string;
}) {

    const ALL_TAGS = ["Tag 1", "Tag 2", "Tag 3", "Tag 4", "Tag 5", "Tag 6"];

    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [poster, setPoster] = useState<File | null>(null);

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
                    className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl"
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
                    <div className="space-y-4">
                        <PosterUploaderDropzone value={poster} onChange={setPoster} />

                        <div>
                            <label className="text-sm font-medium">Event Title</label>
                            <input
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
                                    type="date"
                                    className="mt-1 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-300"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Event date</label>
                                <input
                                    type="date"
                                    className="mt-1 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-300"
                                />
                            </div>
                        </div>

                        <div>
                            <TagSelector
                                tags={ALL_TAGS}
                                value={selectedTags}
                                onChange={setSelectedTags}
                                maxSelected={10}
                                label="Tags"
                            />
                        </div>

                        <button className="mt-2 w-full rounded-xl bg-stone-200 px-4 py-3 text-sm font-semibold text-stone-500">
                            Pin to the Board
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}