// Layout.tsx
import Navbar from "./components/Navbar";
type WrapperProps = {
    navbar?: boolean;
    onPostEvent: () => void;
    filterProps: {
        tags: string[];
        filters: {
            tags: string[];
            deadline: string;
            eventFrom: string;
            eventTo: string;
        };
        onChange: (next: any) => void;
    };
    children: React.ReactNode;
};

export default function Wrapper({ filterProps, navbar, children, onPostEvent }: WrapperProps) {
    return (
        <div className="min-h-screen bg-(--page-bg)">
        {navbar && 
                <Navbar filterProps={filterProps} onPostEvent={onPostEvent} />
            }
            <main className="px-6 py-6">
                {children}
            </main>
        </div>
    );
}