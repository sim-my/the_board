import { SlidersHorizontal } from "lucide-react";
import Button from "./common/Button";
import { useState } from "react";
import TagSelector from "./common/TagSelector";

type Props = {
    all_tags: string[];
    filters: {
        tags: string[];
        deadline: string;
        eventFrom: string;
        eventTo: string;
    };
    onChange: (next: Props["filters"]) => void;
};

export default function FilterBar({all_tags, filters, onChange }: Props) {
    const [open, setOpen] = useState(false);

    const update = (patch: Partial<Props["filters"]>) =>
        onChange({ ...filters, ...patch });

    return (
        <div className="relative px-6 py-3 border-t border-stone-100 w-full">
            <Button
                icon={SlidersHorizontal}
                iconPosition="left"
                size="sm"
                onClick={() => setOpen((v:any) => !v)}
                className={`border ${open
                        ? "text-[var(--accent)] border-[var(--accent)] bg-[var(--page-bg)]"
                        : "border-stone-200"
                    }`}
            >
                Filters
            </Button>

            {open && (
                <div className="absolute left-0 right-0 top-full z-50 bg-white border-x border-b border-stone-200 shadow-md grid grid-cols-1 sm:grid-cols-3 gap-6 px-6 py-6">
                    <TagSelector
                        tags={all_tags}
                        value={filters.tags}
                        onChange={(tags) => update({ tags })}
                        maxSelected={10}
                    />

                    <input
                        type="date"
                        value={filters.deadline}
                        onChange={(e) => update({ deadline: e.target.value })}
                        className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
                    />

                    <div className="flex gap-2">
                        <input
                            type="date"
                            value={filters.eventFrom}
                            onChange={(e) => update({ eventFrom: e.target.value })}
                            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
                        />
                        <input
                            type="date"
                            value={filters.eventTo}
                            onChange={(e) => update({ eventTo: e.target.value })}
                            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}