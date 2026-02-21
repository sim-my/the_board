// FilterBar.tsx
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import Button from "./common/Button";
import TagSelector from "./common/TagSelector";
import type { EventFilters } from "../services/event";

const TAGS = ["Tag 1", "Tag 2", "Tag 3", "Tag 4", "Tag 5", "Tag 6"];

export default function FilterBar({ onApply }: { onApply: (filters: EventFilters) => void }) {
    const [open, setOpen] = useState(false);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [deadline, setDeadline] = useState("");
    const [eventFrom, setEventFrom] = useState("");
    const [eventTo, setEventTo] = useState("");

    const handleApply = () => {
        onApply({
            tags: selectedTags.length ? selectedTags : undefined,
            startDate: eventFrom || undefined,
            endDate: eventTo || undefined,
            registrationDeadline: deadline || undefined,
        });
        setOpen(false);
    };

    const handleClear = () => {
        setSelectedTags([]);
        setDeadline("");
        setEventFrom("");
        setEventTo("");
        onApply({});
        setOpen(false);
    };

    return (
        <div className="relative px-6 py-3 border-t border-stone-100 w-full">
            {/* Toggle button */}
            <Button
                icon={SlidersHorizontal}
                iconPosition="left"
                size="sm"
                onClick={() => setOpen((v) => !v)}
                className={`border ${open ? "text-(--accent)  border-(--accent) bg-(--page-bg)" : " border-stone-200"}`}
            >
                Filters
            </Button>

            {/* Filter panel */}
            {open && (
                <div className="absolute left-0 right-0 top-full z-50 bg-white border-x border-b border-stone-200 shadow-md px-6 py-6 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {/* Filter by TAG */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-stone-700">Filter by TAG</h3>
                            <div className="flex flex-wrap gap-2">
                                <TagSelector
                                    tags={TAGS}
                                    value={selectedTags}
                                    onChange={setSelectedTags}
                                    maxSelected={10}
                                />
                            </div>
                        </div>

                        {/* Filter by Registration Deadline */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-stone-700">Filter by Registration Deadline</h3>
                            <input
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-600 focus:border-(--accent) focus:outline-none"
                            />
                        </div>

                        {/* Filter by Event Date Range */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-stone-700">Filter by Event Date Range</h3>
                            <div className="flex items-center gap-2">
                                <input
                                    type="date"
                                    value={eventFrom}
                                    onChange={(e) => setEventFrom(e.target.value)}
                                    className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-600 focus:border-(--accent) focus:outline-none"
                                />
                                <span className="text-stone-400 text-sm shrink-0">to</span>
                                <input
                                    type="date"
                                    value={eventTo}
                                    onChange={(e) => setEventTo(e.target.value)}
                                    className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-600 focus:border-(--accent) focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 border-t border-stone-100 pt-4">
                        <button
                            type="button"
                            onClick={handleClear}
                            className="px-4 py-2 text-sm font-medium text-stone-500 hover:text-stone-800 cursor-pointer"
                        >
                            Clear
                        </button>
                        <button
                            type="button"
                            onClick={handleApply}
                            className="px-5 py-2 rounded-lg bg-(--accent) text-white text-sm font-semibold hover:opacity-90 cursor-pointer"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
