// Layout.tsx
import Navbar from "./components/Navbar";
import type { EventFilters } from "./services/event";

export default function Wrapper({ navbar, children, onPostEvent, userEmail, onFilterChange, onLogout, boardLayout, setBoardLayout }: { navbar?: boolean; children: React.ReactNode; onPostEvent: () => void; userEmail?: string; onFilterChange: (filters: EventFilters) => void; onLogout: () => void; boardLayout: "board" | "booklet"; setBoardLayout: (v: "board" | "booklet") => void; }) {
    return (
        <div className="flex flex-col h-screen bg-(--page-bg)">
        {navbar &&
                <Navbar onPostEvent={onPostEvent} boardLayout={boardLayout} setBoardLayout={setBoardLayout} userName={userEmail} onFilterChange={onFilterChange} onLogout={onLogout} />
            }
            <main className="flex-1 px-6 pb-6 overflow-hidden">
                {children}
            </main>
        </div>
    );
}
