// App.tsx
import { useEffect, useMemo, useState } from "react";
import CreateEventModal from "./components/CreateEventModal";
import Wrapper from "./Wrapper";
import Login from "./pages/Login";
import InitialView from "./pages/InitialView";
import Board from "./pages/Board";
import PosterDetailView from "./pages/PosterDetailView";
import { tagsService } from "./services/tags";

// --- Types ---
type View = "login" | "initial" | "board" | "detail";

type Filters = {
  tags: string[];
  deadline: string;
  eventFrom: string;
  eventTo: string;
};

export type FilterProps = {
  tags: string[];
  filters: {
    tags: string[];
    deadline: string;
    eventFrom: string;
    eventTo: string;
  };
  onChange: (next: FilterProps["filters"]) => void;
};
export type EventItem = {
  id: string;
  title: string;
  posterUrl: string;
  registrationDeadline: string;
  eventDate: string;
  tags: string[];
  counts: { going: number; maybe: number; not_going: number };
};

async function fetchEvents(): Promise<EventItem[]> {
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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [view, setView] = useState<View>("login");

  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const [isPostEventOpen, setIsPostEventOpen] = useState<boolean>(false);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [filters, setFilters] = useState<Filters>({
    tags: [],
    deadline: "",
    eventFrom: "",
    eventTo: "",
  });

  const [tags, setTags] = useState<string[]>([]);
  const [loadingTags, setLoadingTags] = useState(false);

  const selectedEvent = useMemo(
    () => events.find((e) => e.id === selectedEventId) ?? null,
    [events, selectedEventId]
  );

  const isFilterEmpty = useMemo(
    () =>
      filters.tags.length === 0 &&
      !filters.deadline &&
      !filters.eventFrom &&
      !filters.eventTo,
    [filters]
  );

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (filters.tags.length && !filters.tags.some((t) => e.tags.includes(t)))
        return false;

      if (filters.deadline && e.registrationDeadline !== filters.deadline)
        return false;

      if (filters.eventFrom && e.eventDate < filters.eventFrom) return false;
      if (filters.eventTo && e.eventDate > filters.eventTo) return false;

      return true;
    });
  }, [events, filters]);

  // Load initial data after login
  useEffect(() => {
    if (!isLoggedIn) return;

    (async () => {
      setLoadingTags(true);
      try {
        const data = await tagsService.list();
        setTags(data.map((t:any) => t.name));
      } finally {
        setLoadingTags(false);
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

  return (
    <Wrapper filterProps={{
      tags,
      filters,
      onChange: setFilters,
    }}
    navbar={isLoggedIn} onPostEvent={openPostEvent}>
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

      {view === "board" && isFilterEmpty && (
        <InitialView onContinue={() => setView("board")} />
      )}

      {view === "board" && !isFilterEmpty && (
        <Board
          events={filteredEvents}
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