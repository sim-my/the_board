// Navbar.jsx
import { IdCard, LucidePlus } from "lucide-react";
import Button from "./common/Button";

export default function Navbar({ userName = "Simran Panthi", onPostEvent }: { userName?: string; onPostEvent: () => void }) {

    return (
        <header className="w-full bg-white px-4 py-3 border border-stone-200">
            <div className="flex items-center justify-between gap-3">
                {/* left */}
                <div className="flex items-center gap-2 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center">
                        <IdCard className="h-6 w-6 text-(--accent)" />
                    </div>
                    <div className="flex items-baseline gap-2 min-w-0">
                        <h1 className="text-xl sm:text-3xl font-semibold whitespace-nowrap">
                            The Board
                        </h1>
                        <span className="text-base sm:text-lg text-stone-400 hidden xs:inline">|</span>
                        <span className="text-sm sm:text-lg font-medium text-stone-400 truncate hidden sm:inline">
                            {userName}
                        </span>
                    </div>
                </div>

                {/* right */}
                <Button
                    type="button"
                    onClick={onPostEvent}
                    icon={LucidePlus}
                    iconPosition="left"
                    className="shrink-0 bg-(--accent) px-4 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-(--surface) hover:text-(--accent) border border-(--accent) cursor-pointer whitespace-nowrap"
                >
                    Post an event
                </Button>
            </div>
        </header>
    );
}