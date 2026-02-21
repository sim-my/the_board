import { api } from "./api";

export type Event = {
  id: string;
  title: string;
  posterUrl: string;
  registrationDeadline: string;
  eventDate: string;
  tags: string[];
};

export const eventsService = {
  list: () => api.get<Event[]>("/events"),
  create: (payload: Partial<Event>) => api.post<Event>("/events", payload),
  getById: (id: string) => api.get<Event>(`/events/${id}`),
};
