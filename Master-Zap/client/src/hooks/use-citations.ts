import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

function parseWithLogging<T>(schema: any, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useCitations() {
  return useQuery({
    queryKey: [api.citations.list.path],
    queryFn: async () => {
      const res = await fetch(api.citations.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch citations");
      const data = await res.json();
      return parseWithLogging<any>(api.citations.list.responses[200], data, "citations.list");
    },
  });
}
