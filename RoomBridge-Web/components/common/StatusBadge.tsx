import type { RoomStatus } from "@/types/room";
import { STATUS_LABEL } from "@/types/room";

const DOT: Record<RoomStatus, string> = {
  PENDING: "bg-[rgb(214_158_46)]",
  APPROVED: "bg-[rgb(34_160_110)]",
  REJECTED: "bg-[rgb(198_56_44)]",
};

const CLASS: Record<RoomStatus, string> = {
  PENDING: "badge-pending",
  APPROVED: "badge-approved",
  REJECTED: "badge-rejected",
};

/**
 * Moderation state pill. `isActive={false}` overrides the status label — a paused
 * listing is off the market regardless of what the admin decided.
 */
export default function StatusBadge({
  status,
  isActive = true,
  className = "",
}: {
  status: RoomStatus;
  isActive?: boolean;
  className?: string;
}) {
  if (!isActive) {
    return (
      <span className={`badge badge-paused ${className}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-faint" aria-hidden />
        Paused
      </span>
    );
  }

  return (
    <span className={`badge ${CLASS[status]} ${className}`}>
      <span
        className={`h-1.5 w-1.5 rounded-full ${DOT[status]} ${
          status === "PENDING" ? "animate-pulse" : ""
        }`}
        aria-hidden
      />
      {STATUS_LABEL[status]}
    </span>
  );
}
