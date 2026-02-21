// App.tsx
import React, { useEffect, useMemo, useState } from "react";
import CreateEventModal from "./components/CreateEventModal";
import Wrapper from "./Wrapper";
import Login from "./pages/Login";
import InitialView from "./pages/InitialView";
import Board from "./pages/Board";
import PosterDetailView from "./pages/PosterDetailView";

// --- Types ---
type View = "login" | "initial" | "board" | "detail";

export type EventItem = {
  id: string;
  title: string;
  posterUrl: string;
  registrationDeadline: string;
  eventDate: string;
  tags: string[];
  counts: { going: number; maybe: number; not_going: number };
};

// --- Fake API (replace with your services) ---
async function fetchEvents(): Promise<EventItem[]> {
  // replace with eventsService.list()
  return [
    {
      id: "1",
      title: "Sample Event",
      posterUrl: "/sample_posters/poster_1.png",
      registrationDeadline: "2023-01-01",
      eventDate: "2023-01-01",
      tags: ["Tag 1", "Tag 2"],
      counts: { going: 12, maybe: 5, not_going: 2 },
    },
  ];
}

export default function App() {
  // Auth + view
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [view, setView] = useState<View>("login");

  // Data
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // UI state
  const [isPostEventOpen, setIsPostEventOpen] = useState<boolean>(false);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const selectedEvent = useMemo(
    () => events.find((e) => e.id === selectedEventId) ?? null,
    [events, selectedEventId]
  );

  // Load initial data after login
  useEffect(() => {
    if (!isLoggedIn) return;

    (async () => {
      setLoadingEvents(true);
      setError("");
      try {
        const data = await fetchEvents();
        setEvents(data);
        setView("board");
      } catch {
        setError("Failed to load events.");
      } finally {
        setLoadingEvents(false);
      }
    })();
  }, [isLoggedIn]);

  // --- Handlers ---
  const openPostEvent = () => setIsPostEventOpen(true);
  const closePostEvent = () => setIsPostEventOpen(false);

  const openEventDetail = (id: string) => {
    setSelectedEventId(id);
    setView("detail");
  };

  const closeEventDetail = () => {
    setView("board");
    setSelectedEventId(null);
  };

  const onLoginSuccess = () => {
    setIsLoggedIn(true);
    setView("board");
  };

  const onLogout = () => {
    setIsLoggedIn(false);
    setView("login");
    setSelectedEventId(null);
    setEvents([]);
  };

  return (
    <Wrapper navbar={isLoggedIn} onPostEvent={openPostEvent}>
      {/* Global modal */}
      <CreateEventModal
        open={isPostEventOpen}
        onClose={() => setIsPostEventOpen(false)}
        onCreate={(payload) => {
          // parent does API call + updates events list
          console.log(payload);
          setIsPostEventOpen(false);
        }}
      />

      {/* Views */}
      {view === "login" && <Login onSuccess={onLoginSuccess} />}

      {view === "initial" && <InitialView onContinue={() => setView("board")} />}

      {view === "board" && (
        <Board
          events={events}
          loading={loadingEvents}
          error={error}
          onOpenEvent={openEventDetail}
        />
      )}

      {view === "detail" && selectedEvent && (
        <PosterDetailView event={selectedEvent} onClose={closeEventDetail} />
      )}
    </Wrapper>
  );
}