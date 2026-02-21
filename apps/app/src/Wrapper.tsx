// Layout.tsx (Wrapper)
import Navbar from "./components/Navbar";

export default function Wrapper({
    children,
    onPostEvent,
    view,
    setView
}: {
    children: React.ReactNode;
    onPostEvent: () => void;
    view: "board" | "booklet";
    setView: (v: "board" | "booklet") => void;
}) {

    return (
        <div className="min-h-screen bg-(--page-bg)">
            {/* nav bar gets view and setView so it can toggle */}
            <Navbar 
                onPostEvent={onPostEvent}
                view={view}
                setView={setView}
            />

            {/* page content */}
            <main className="px-6 py-6">
                {children}
            </main>
        </div>
    );
}
