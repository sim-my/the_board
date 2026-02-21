// Navbar.jsx
import { LucidePlus, LayoutDashboard, LogOut } from "lucide-react";
import Button from "./common/Button";
import FilterBar from "./Filters";
import type { EventFilters } from "../services/event";

export default function Navbar({ userName = "simranpanthi101@gmail.com", onPostEvent, onFilterChange, onLogout }: { userName?: string; onPostEvent: () => void; onFilterChange: (filters: EventFilters) => void; onLogout: () => void }) {

    return (
        <header className="w-full bg-white  border border-stone-200">
            <div className="flex items-center justify-between gap-3 px-4 py-3">
                {/* left */}
                <div className="flex items-center gap-2 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center">
                        <LayoutDashboard className="h-6 w-6 text-(--accent)" />
                    </div>
                    <div className="flex items-baseline gap-2 min-w-0">
                        <h1 className="text-xl sm:text-3xl font-semibold whitespace-nowrap">
                            The Board
                        </h1>
                        <span className="text-sm sm:text-lg font-medium text-stone-400 truncate hidden sm:inline">
                           | {userName}
                        </span>
                    </div>
                </div>

                {/* right */}
                <div className="flex items-center gap-2 shrink-0">
                    <Button
                        type="button"
                        onClick={onPostEvent}
                        icon={LucidePlus}
                        iconPosition="left"
                        className="bg-(--accent) px-4 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-(--surface) hover:text-(--accent) border border-(--accent) cursor-pointer whitespace-nowrap"
                    >
                        Post an event
                    </Button>
                    <button
                        type="button"
                        onClick={onLogout}
                        title="Log out"
                        className="flex items-center justify-center rounded-xl border border-stone-200 p-2.5 text-stone-500 hover:border-stone-300 hover:text-stone-800 cursor-pointer transition"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </div>
            <div className="w-full">
                <FilterBar onApply={onFilterChange} />
            </div>
        </header>
    );
}
