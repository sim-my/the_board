// Layout.tsx
import Navbar from "./components/Navbar";

export default function Wrapper({ children, onPostEvent }: { children: React.ReactNode; onPostEvent: () => void }) {
    return (
        <div className="min-h-screen bg-(--page-bg)">
            <Navbar onPostEvent={onPostEvent} />
            <main className="px-6 py-6">
                {children}
            </main>
        </div>
    );
}