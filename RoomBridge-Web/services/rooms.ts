import api from "./api";
import type {
  ModerationRoom,
  OwnedRoom,
  Pagination,
  Room,
  RoomDetail,
  RoomFilters,
  RoomFormValues,
  RoomStatus,
} from "@/types/room";

/** Turn the filter object into a query string, dropping empty values. */
function toQuery(filters: RoomFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      if (value.length) params.set(key, value.join(","));
      return;
    }
    params.set(key, String(value));
  });
  return params.toString();
}

export async function fetchRooms(
  filters: RoomFilters = {}
): Promise<{ rooms: Room[]; pagination: Pagination }> {
  const query = toQuery(filters);
  const { data } = await api.get(`/rooms${query ? `?${query}` : ""}`);
  return { rooms: data.data, pagination: data.pagination };
}

export async function fetchRoomById(id: string): Promise<RoomDetail> {
  const { data } = await api.get(`/rooms/${id}`);
  return data.data;
}

export async function fetchMyListings(): Promise<OwnedRoom[]> {
  const { data } = await api.get("/rooms/my-listings");
  return data.data;
}

export async function createRoom(values: RoomFormValues): Promise<OwnedRoom> {
  const { data } = await api.post("/rooms", values);
  return data.data;
}

export async function updateRoom(
  id: string,
  values: Partial<RoomFormValues> & { isActive?: boolean }
): Promise<OwnedRoom> {
  const { data } = await api.put(`/rooms/${id}`, values);
  return data.data;
}

export async function deleteRoom(id: string): Promise<void> {
  await api.delete(`/rooms/${id}`);
}

export async function resubmitRoom(id: string): Promise<OwnedRoom> {
  const { data } = await api.post(`/rooms/${id}/resubmit`);
  return data.data;
}

/** Uploads go through Cloudinary, so they get a much longer leash than normal calls. */
export async function uploadRoomImages(
  id: string,
  files: File[],
  onProgress?: (percent: number) => void
): Promise<OwnedRoom> {
  const form = new FormData();
  files.forEach((file) => form.append("images", file));

  const { data } = await api.post(`/rooms/${id}/images`, form, {
    timeout: 120000,
    onUploadProgress: (event) => {
      if (!onProgress || !event.total) return;
      onProgress(Math.round((event.loaded * 100) / event.total));
    },
  });
  return data.data;
}

export async function deleteRoomImage(
  id: string,
  imageUrl: string
): Promise<OwnedRoom> {
  const { data } = await api.delete(`/rooms/${id}/images`, {
    data: { imageUrl },
  });
  return data.data;
}

// ─── Admin moderation ────────────────────────────────

export interface AdminStats {
  rooms: { pending: number; approved: number; rejected: number; live: number };
  users: number;
  bookings: number;
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const { data } = await api.get("/admin/stats");
  return data.data;
}

export async function fetchModerationQueue(params: {
  status?: RoomStatus | "ALL";
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ rooms: ModerationRoom[]; pagination: Pagination }> {
  const query = toQuery(params as RoomFilters);
  const { data } = await api.get(`/admin/rooms${query ? `?${query}` : ""}`);
  return { rooms: data.data, pagination: data.pagination };
}

export async function approveRoom(id: string): Promise<ModerationRoom> {
  const { data } = await api.patch(`/admin/rooms/${id}/approve`);
  return data.data;
}

export async function rejectRoom(
  id: string,
  reason: string
): Promise<ModerationRoom> {
  const { data } = await api.patch(`/admin/rooms/${id}/reject`, { reason });
  return data.data;
}

/** Normalises an axios error into a message safe to show a user. */
export function apiErrorMessage(err: unknown, fallback = "Something went wrong"): string {
  const maybe = err as { response?: { data?: { message?: string } }; message?: string };
  return maybe?.response?.data?.message || maybe?.message || fallback;
}
