import { IdCard, LucidePlus } from "lucide-react";
import Button from "./common/Button";
import FilterBar from "./Filters";

export default function Navbar({
    userName = "Simran Panthi",
    onPostEvent,
    view,
    setView
}: {
    userName?: string;
    onPostEvent: () => void;
    view: "board" | "booklet";
    setView: (v: "board" | "booklet") => void;
}) {

    return (
        <header className="w-full bg-white  border border-stone-200">
            <div className="flex items-center justify-between gap-3 px-4 py-3">

                {/* left */}
                <div className="flex items-center gap-4 min-w-0">

                    {/* icon */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center">
                        <IdCard className="h-6 w-6 text-(--accent)" />
                    </div>

                    {/* title + username */}
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

                <div className="flex items-center gap-4">
                    {/* toggle between board and booklet */}
                    <div className="flex bg-gray-200 rounded overflow-hidden">
                        <button
                            onClick={() => setView("board")}
                            className={`px-3 py-1 text-sm ${
                                view === "board"
                                    ? "bg-white font-semibold"
                                    : "text-gray-500"
                            }`}
                        >
                            Board
                        </button>

                        <button
                            onClick={() => setView("booklet")}
                            className={`px-3 py-1 text-sm ${
                                view === "booklet"
                                    ? "bg-white font-semibold"
                                    : "text-gray-500"
                            }`}
                        >
                            Booklet
                        </button>
                    </div>
                     <Button
                        type="button"
                        onClick={onPostEvent}
                        icon={LucidePlus}
                        iconPosition="left"
                        className="shrink-0 bg-(--accent) px-4 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-(--surface) hover:text-(--accent) border border-(--accent) cursor-pointer whitespace-nowrap"
                        >Post an event
                    </Button>
                
                </div>
                               
            </div>

            {/* filters */}
            <div className="w-full">
                <FilterBar />
            </div>
        </header>
    );
}
