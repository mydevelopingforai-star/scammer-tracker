import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { TrackingLink, InsertTrackingLink } from "@shared/schema";

export function useLinks() {
  return useQuery({
    queryKey: [api.links.list.path],
    queryFn: async () => {
      const res = await fetch(api.links.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch tracking links");
      const data = await res.json();
      return api.links.list.responses[200].parse(data);
    },
  });
}

export function useLinkByToken(token: string) {
  return useQuery({
    queryKey: [api.links.get.path, token],
    queryFn: async () => {
      const url = buildUrl(api.links.get.path, { token });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) throw new Error("Link not found");
      if (!res.ok) throw new Error("Failed to fetch link details");
      const data = await res.json();
      return api.links.get.responses[200].parse(data);
    },
    retry: false,
  });
}

export function useCreateLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertTrackingLink) => {
      const validated = api.links.create.input.parse(data);
      const res = await fetch(api.links.create.path, {
        method: api.links.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create tracking link");
      }
      
      const responseData = await res.json();
      return api.links.create.responses[201].parse(responseData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.links.list.path] });
    },
  });
}
