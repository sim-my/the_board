import { LucideCalendarSearch, LucidePlus } from "lucide-react";
import Button from "../components/common/Button";

export default function EmptyView() {
    return (
        
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] gap-5">
            <LucideCalendarSearch className="h-24 w-24 text-(--accent-light)" />
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-xl sm:text-3xl font-semibold text-stone-400">No events found</h1>
                <p className="text-sm text-stone-400">Post an event to view a board</p>
            </div>
            
            <Button
                type="button"
                onClick={() => {}}
                icon={LucidePlus}
                iconPosition="left"
                className="shrink-0 bg-(--accent) px-4 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-(--surface) hover:text-(--accent) border border-(--accent) cursor-pointer whitespace-nowrap"
            >
                Post an event
            </Button>
        </div>
    )
    ;
}