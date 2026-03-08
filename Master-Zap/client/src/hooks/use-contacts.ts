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

export function useContacts() {
  return useQuery({
    queryKey: [api.contacts.list.path],
    queryFn: async () => {
      const res = await fetch(api.contacts.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch contacts");
      const data = await res.json();
      return parseWithLogging<any>(api.contacts.list.responses[200], data, "contacts.list");
    },
  });
}

export function useContact(id: number | null) {
  return useQuery({
    queryKey: [api.contacts.get.path, id],
    queryFn: async () => {
      if (id === null) return null;
      const url = buildUrl(api.contacts.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch contact");
      const data = await res.json();
      return parseWithLogging<any>(api.contacts.get.responses[200], data, "contacts.get");
    },
    enabled: id !== null,
  });
}
