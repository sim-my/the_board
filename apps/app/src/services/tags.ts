import { api } from "./api";

export type Tag = {
  id: string;
  name: string;
};

export const tagsService = {
  list: () => api.get<Tag[]>("/tags"),
};
