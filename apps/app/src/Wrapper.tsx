// Layout.tsx
import Navbar from "./components/Navbar";

export default function Wrapper({ navbar, children, onPostEvent }: { navbar?: boolean; children: React.ReactNode; onPostEvent: () => void }) {
    return (
        <div className="min-h-screen bg-(--page-bg)">
        {navbar && 
                <Navbar onPostEvent={onPostEvent} />
            }
            <main className="px-6 py-6">
                {children}
            </main>
        </div>
    );
}