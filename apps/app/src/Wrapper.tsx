// Layout.tsx
import Navbar from "./components/Navbar";
import type { EventFilters } from "./services/event";

export default function Wrapper({ navbar, children, onPostEvent, userEmail, onFilterChange, onLogout, boardLayout, setBoardLayout }: { navbar?: boolean; children: React.ReactNode; onPostEvent: () => void; userEmail?: string; onFilterChange: (filters: EventFilters) => void; onLogout: () => void;     boardLayout: "board" | "booklet";
    setBoardLayout: (v: "board" | "booklet") => void;  }) {
    return (
        <div className="min-h-screen bg-(--page-bg)">
        {navbar &&
                <Navbar onPostEvent={onPostEvent} boardLayout={boardLayout} setBoardLayout={setBoardLayout} userName={userEmail} onFilterChange={onFilterChange} onLogout={onLogout} />
            }
            <main className="px-6 py-6">
                {children}
            </main>
        </div>
    );
}
