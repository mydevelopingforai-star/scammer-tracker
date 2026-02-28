import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

interface CreateCapturePayload {
  linkId: number;
  ipAddress?: string;
  userAgent?: string;
  latitude?: string;
  longitude?: string;
  accuracy?: string;
  imageData?: string;
}

export function useCaptures(linkId: number | undefined) {
  return useQuery({
    queryKey: [api.captures.list.path, linkId],
    queryFn: async () => {
      if (!linkId) throw new Error("Link ID required");
      const url = buildUrl(api.captures.list.path, { linkId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch captures");
      const data = await res.json();
      return api.captures.list.responses[200].parse(data);
    },
    enabled: !!linkId,
  });
}

export function useCreateCapture() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ linkId, ...data }: CreateCapturePayload) => {
      const url = buildUrl(api.captures.create.path, { linkId });
      const validated = api.captures.create.input.parse(data);
      
      const res = await fetch(url, {
        method: api.captures.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error("Failed to submit capture");
      }
      
      const responseData = await res.json();
      return api.captures.create.responses[201].parse(responseData);
    },
    onSuccess: (_, variables) => {
      // Invalidate captures for this specific link
      queryClient.invalidateQueries({ 
        queryKey: [api.captures.list.path, variables.linkId] 
      });
    },
  });
}
