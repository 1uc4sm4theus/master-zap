import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

function parseWithLogging<T>(schema: any, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useMessages(contactId: number | null) {
  return useQuery({
    queryKey: [api.messages.list.path, contactId],
    queryFn: async () => {
      if (contactId === null) return [];
      const url = buildUrl(api.messages.list.path, { contactId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      return parseWithLogging<any>(api.messages.list.responses[200], data, "messages.list");
    },
    enabled: contactId !== null,
  });
}
