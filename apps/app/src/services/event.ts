import { api } from "./api";
import type { EventItem } from "../App";

export type EventFilters = {
  tags?: string[];
  startDate?: string;
  endDate?: string;
  registrationDeadline?: string;
};

type ApiEvent = {
  id: number;
  title: string;
  posterUrl: string | null;
  description: string;
  date: string;
  affiliation: string | null;
  tags: string[] | null;
  creatorId: number;
  registrationDeadline: string | null;
};

function mapEvent(e: ApiEvent): EventItem {
  return {
    id: String(e.id),
    title: e.title,
    posterUrl: e.posterUrl ?? "",
    eventDate: e.date,
    registrationDeadline: e.registrationDeadline ?? "",
    tags: e.tags ?? [],
    counts: { going: 0, maybe: 0, not_going: 0 },
  };
}

export type CreateEventPayload = {
  title: string;
  description: string;
  registrationDeadline: string;
  eventDate: string;
  tags: string[];
  poster: File | null;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export const eventsService = {
  list: async (filters?: EventFilters): Promise<EventItem[]> => {
    const params = new URLSearchParams();
    if (filters?.tags?.length) params.set("tags", filters.tags.join(","));
    if (filters?.startDate) params.set("startDate", filters.startDate);
    if (filters?.endDate) params.set("endDate", filters.endDate);
    if (filters?.registrationDeadline) params.set("registrationDeadline", filters.registrationDeadline);
    const query = params.toString();
    const res = await api.get<{ events: ApiEvent[] }>(`/event/getEvents${query ? `?${query}` : ""}`);
    return res.events.map(mapEvent);
  },

  create: async (payload: CreateEventPayload, creatorEmail: string): Promise<void> => {
    const form = new FormData();
    form.append("title", payload.title);
    form.append("description", payload.description);
    form.append("date", payload.eventDate);
    form.append("registrationDeadline", payload.registrationDeadline);
    form.append("tags", payload.tags.join(","));
    form.append("creatorEmail", creatorEmail);
    if (payload.poster) form.append("posterImage", payload.poster);

    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/event/createEvent`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.message ?? "Failed to create event");
    }
  },
};
