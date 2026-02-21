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

export const eventsService = {
  list: async (filters?: EventFilters): Promise<EventItem[]> => {
    const params = new URLSearchParams();
    if (filters?.tags?.length) params.set("tags", filters.tags.join(","));
    if (filters?.startDate) params.set("startDate", filters.startDate);
    if (filters?.endDate) params.set("endDate", filters.endDate);
    if (filters?.registrationDeadline) params.set("registrationDeadline", filters.registrationDeadline);
    const query = params.toString();
    const res = await api.get<{ events: ApiEvent[] }>(`/api/event/getEvents${query ? `?${query}` : ""}`);
    return res.events.map(mapEvent);
  },
};
