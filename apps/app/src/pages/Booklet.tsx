import { useState } from "react";
import { MoveLeft, MoveRight } from "lucide-react";

import Button from "../components/common/Button";
import type { EventItem } from "../App";

type Props = {
    events: EventItem[];
    onOpenEvent: (id: string) => void;
};

export default function Booklet({ events, onOpenEvent }: Props) {

    // to keep track of which poster is showing, page = 0 initially
    const [currentIndex, setIndex] = useState(0);

    if (events.length === 0) {
        return (
            <div className="flex items-center justify-center py-24 text-stone-400">
                No events to show.
            </div>
        );
    }

    const event = events[currentIndex];

    // go back one poster
    function flipPrev() {
        setIndex((i) => Math.max(0, i - 1));
    }

    // go to next poster
    function flipNext() {
        setIndex((i) => Math.min(events.length - 1, i + 1));
    }

    return (
    <div className="p-4">
        <p className="text-lg font-medium text-gray-700 text-center">{currentIndex + 1} / {events.length}</p>
        {/* poster area */}
        <div
            className="mt-4 border rounded-lg bg-white shadow w-full max-w-md mx-auto flex items-center justify-center aspect-3/4 overflow-hidden cursor-pointer"
            onClick={() => onOpenEvent(event.id)}
        >
            {event.posterUrl ? (
                <img src={event.posterUrl} alt={event.title} className="w-full h-full object-cover" />
            ) : (
                <div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
                    <span className="text-xl font-semibold text-stone-700">{event.title}</span>
                    <span className="text-sm text-stone-400">{event.eventDate}</span>
                </div>
            )}
        </div>
        {/* attendance counts */}
        <div className="flex justify-center gap-6 mt-3 text-sm text-stone-500">
            <span><span className="font-semibold text-green-600">{event.counts.going}</span> Going</span>
            <span><span className="font-semibold text-yellow-500">{event.counts.maybe}</span> Maybe</span>
            <span><span className="font-semibold text-red-400">{event.counts.not_going}</span> Not going</span>
        </div>
        {/* next and prev buttons */}
        <div className="flex justify-center gap-6 mt-4">
        <Button onClick={flipPrev} type="button" icon={MoveLeft} className="shrink-0 bg-(--accent) px-4 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-(--surface) hover:text-(--accent) border border-(--accent) cursor-pointer whitespace-nowrap">
            Prev
        </Button>
        <Button onClick={flipNext} type="button" icon={MoveRight} className="shrink-0 bg-(--accent) px-4 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-(--surface) hover:text-(--accent) border border-(--accent) cursor-pointer whitespace-nowrap">
            Next
        </Button>
        </div>
    </div>
    );
}
