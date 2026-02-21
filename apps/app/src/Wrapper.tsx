// Layout.tsx
import Navbar from "./components/Navbar";

export default function Wrapper({ navbar, children, onPostEvent }: { navbar?: boolean; children: React.ReactNode; onPostEvent: () => void }) {
    return (
        <div className="h-screen flex flex-col bg-(--page-bg) overflow-hidden">
        {navbar && 
                <Navbar onPostEvent={onPostEvent} />
            }
            <main className="flex-1 px-6 pb-6 overflow-hidden">
                {children}
            </main>
        </div>
    );
}