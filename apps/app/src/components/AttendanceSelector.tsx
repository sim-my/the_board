// AttendanceSelector.tsx
import React from "react";
import { CheckCircle2, HelpCircle, XCircle } from "lucide-react";

export type AttendanceStatus = "going" | "maybe" | "not_going" | null;

type Counts = {
    going: number;
    maybe: number;
    not_going: number;
};

type Props = {
    value: AttendanceStatus;
    onChange: (next: AttendanceStatus) => void;
    counts: Counts;
};

export default function AttendanceSelector({ value, onChange, counts }: Props) {
    const buttons: Array<{
        key: Exclude<AttendanceStatus, null>;
        label: string;
        icon: React.ReactNode;
        count: number;
        selectedClasses: string;
    }> = [
            {
                key: "going",
                label: "Going",
                icon: <CheckCircle2 className="h-4 w-4" />,
                count: counts.going,
                selectedClasses: "border-green-600 bg-green-50 text-green-800",
            },
            {
                key: "maybe",
                label: "Maybe",
                icon: <HelpCircle className="h-4 w-4" />,
                count: counts.maybe,
                selectedClasses: "border-yellow-600 bg-yellow-50 text-yellow-800",
            },
            {
                key: "not_going",
                label: "Not going",
                icon: <XCircle className="h-4 w-4" />,
                count: counts.not_going,
                selectedClasses: "border-red-600 bg-red-50 text-red-800",
            },
        ];

    const toggle = (next: Exclude<AttendanceStatus, null>) => {
        // click again to unselect
        onChange(value === next ? null : next);
    };

    return (
        <div className="space-y-2 mt-5">
            <h1 className="text-2xl font-medium text-stone-800">Will you attend?</h1>

            <div className="flex flex-col gap-4">
                {buttons.map((b) => {
                    const selected = value === b.key;

                    return (
                        <button
                            key={b.key}
                            type="button"
                            onClick={() => toggle(b.key)}
                            className={[
                                "flex items-center w-40 gap-2 rounded-xl border px-3 py-3 text-md font-semibold transition",
                                "cursor-pointer select-none",
                                selected
                                    ? b.selectedClasses
                                    : "border-stone-200 bg-white text-stone-700 hover:text-(--accent) hover:border-(--accent)",
                            ].join(" ")}
                        >
                            {b.icon}
                            <span>{b.label}</span>

                            <span
                                className={[
                                    "ml-1 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold",
                                    selected ? "bg-white/70" : "bg-stone-100 text-stone-700",
                                ].join(" ")}
                            >
                                {b.count}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}