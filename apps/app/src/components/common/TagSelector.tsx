// TagSelector.tsx
import React, { useMemo } from "react";

export type TagSelectorProps = {
    tags: string[];
    value: string[];
    onChange: (next: string[]) => void;
    maxSelected?: number;
    label?: string;
};

export default function TagSelector({
    tags,
    value,
    onChange,
    maxSelected = 3,
    label,
}: TagSelectorProps) {
    const selected = value;
    const atLimit = selected.length >= maxSelected;

    const helperText = useMemo(
        () => `${selected.length}/${maxSelected} selected`,
        [selected.length, maxSelected]
    );

    const toggle = (tag: string) => {
        const isSelected = selected.includes(tag);

        if (isSelected) {
            onChange(selected.filter((t) => t !== tag));
            return;
        }

        if (atLimit) return;
        onChange([...selected, tag]);
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-stone-800">{label}</label>
            </div>

            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                    const isSelected = selected.includes(tag);
                    const disabled = !isSelected && atLimit;

                    return (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => toggle(tag)}
                            disabled={disabled}
                            className={[
                                "rounded-full px-3 py-1.5 text-sm border transition",
                                "cursor-pointer disabled:cursor-not-allowed disabled:hover:bg-white disabled:opacity-40",
                                isSelected
                                    ? "border-amber-800 bg-amber-50 text-amber-900"
                                    : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50",
                            ].join(" ")}
                        >
                            {tag}
                        </button>
                    );
                })}
            </div>
            <span className="text-xs text-stone-500">{helperText}</span>

        </div>
    );
}