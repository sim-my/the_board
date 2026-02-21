// App.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import CreateEventModal from "./components/CreateEventModal";
import Wrapper from "./Wrapper";
import Login from "./pages/Login";
import InitialView from "./pages/InitialView";
import Board from "./pages/Board";
import PosterDetailView from "./pages/PosterDetailView";
import { eventsService, type EventFilters } from "./services/event";
import { authService } from "./services/auth";

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

export default function App() {
  // Auth + view
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>(() => localStorage.getItem("email") ?? "");
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

  const loadEvents = useCallback(async (filters?: EventFilters) => {
    setLoadingEvents(true);
    setError("");
    try {
      const data = await eventsService.list(filters);
      setEvents(data);
    } catch {
      setError("Failed to load events.");
    } finally {
      setLoadingEvents(false);
    }
  }, []);

  // Load initial data after login
  useEffect(() => {
    if (!isLoggedIn) return;
    loadEvents();
  }, [isLoggedIn, loadEvents]);

  // --- Handlers ---
  const openPostEvent = () => setIsPostEventOpen(true);

  const openEventDetail = (id: string) => {
    setSelectedEventId(id);
    setView("detail");
  };

  const closeEventDetail = () => {
    setView("board");
    setSelectedEventId(null);
  };

  const onLoginSuccess = (email: string) => {
    setUserEmail(email);
    setIsLoggedIn(true);
    setView("board");
  };

  const onFilterChange = (filters: EventFilters) => {
    loadEvents(filters);
  };

  const onLogout = async () => {
    await authService.logout().catch(() => {});
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setUserEmail("");
    setIsLoggedIn(false);
    setView("login");
    setSelectedEventId(null);
    setEvents([]);
  };

  return (
    <Wrapper navbar={isLoggedIn} onPostEvent={openPostEvent} userEmail={userEmail} onFilterChange={onFilterChange} onLogout={onLogout}>
      {/* Global modal */}
      <CreateEventModal
        open={isPostEventOpen}
        onClose={() => setIsPostEventOpen(false)}
        onCreate={(payload) => {
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
