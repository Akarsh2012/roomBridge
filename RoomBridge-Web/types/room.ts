export type RoomStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface RoomHost {
  id: string;
  name: string;
  avatar?: string | null;
  createdAt: string;
}

/** Shape returned by the public list endpoint. */
export interface Room {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  city: string;
  country: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  createdAt: string;
  host: RoomHost;
}

/** Extra fields only the owner or an admin ever receives. */
export interface OwnedRoom extends Room {
  address?: string | null;
  status: RoomStatus;
  rejectionReason?: string | null;
  isActive: boolean;
  submittedAt: string;
  reviewedAt?: string | null;
  updatedAt: string;
  _count?: { bookings: number; reviews: number };
}

export interface RoomReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { id: string; name: string; avatar?: string | null };
}

export interface RoomDetail extends Partial<OwnedRoom> {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  city: string;
  country: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  createdAt: string;
  host: RoomHost;
  isOwner: boolean;
  rating: { average: number | null; count: number };
  reviews: RoomReview[];
}

/** A listing as the admin moderation queue sees it. */
export interface ModerationRoom extends Omit<OwnedRoom, "host" | "_count"> {
  host: RoomHost & { email: string; emailVerified: boolean };
  reviewedBy?: { id: string; name: string } | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export type SortOption = "newest" | "price_asc" | "price_desc";

export interface RoomFilters {
  city?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  guests?: number;
  bedrooms?: number;
  amenities?: string[];
  sort?: SortOption;
  page?: number;
  limit?: number;
}

export interface RoomFormValues {
  title: string;
  description: string;
  price: number;
  location: string;
  address?: string;
  city: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
}

/** Options offered in the listing form and the filter panel. */
export const AMENITY_OPTIONS = [
  "WiFi",
  "AC",
  "Kitchen",
  "Parking",
  "Washing Machine",
  "TV",
  "Pool",
  "Gym",
  "Balcony",
  "Workspace",
  "Heating",
  "Pet Friendly",
  "Breakfast",
  "Power Backup",
] as const;

export const POPULAR_CITIES = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Goa",
  "Jaipur",
  "Manali",
  "Pondicherry",
  "Alleppey",
] as const;

export const STATUS_LABEL: Record<RoomStatus, string> = {
  PENDING: "In review",
  APPROVED: "Live",
  REJECTED: "Needs changes",
};
