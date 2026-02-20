// FilterBar.tsx
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import Button from "./common/Button";

const TAGS = ["Tag 1", "Tag 2", "Tag 3", "Tag 4", "Tag 5", "Tag 6"];

export default function FilterBar() {
    const [open, setOpen] = useState(false);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [deadline, setDeadline] = useState("");
    const [eventFrom, setEventFrom] = useState("");
    const [eventTo, setEventTo] = useState("");

    const toggleTag = (tag: string) =>
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );

    return (
        <div className="relative px-6 py-3 border-t border-stone-100 w-full">
            {/* Toggle button */}                <Button
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
                <div className="absolute left-0 right-0 top-full z-50 bg-white border-x border-b border-stone-200 shadow-md grid grid-cols-1 sm:grid-cols-3 gap-6 px-6 py-6">

                    {/* Filter by TAG */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-stone-700">Filter by TAG</h3>
                        <div className="flex flex-wrap gap-2">
                            {TAGS.map((tag) => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => toggleTag(tag)}
                                    className={`rounded-lg border px-3 py-1 text-xs font-medium transition-colors cursor-pointer
                                        ${selectedTags.includes(tag)
                                            ? "bg-(--accent) text-white border-(--accent)"
                                            : "bg-white text-stone-600 border-stone-200 hover:border-(--accent) hover:text-(--accent)"
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
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
            )}
        </div>
    );
}