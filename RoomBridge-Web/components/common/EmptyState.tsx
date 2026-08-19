import Link from "next/link";

/** Shared "nothing here yet" panel — keeps empty screens intentional, not broken-looking. */
export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  icon,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <div className="surface lift mx-auto flex max-w-md flex-col items-center rounded-3xl px-6 py-12 text-center sm:px-10">
      <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber/12 text-amber ring-1 ring-amber/25">
        {icon ?? (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10h14V10" />
          </svg>
        )}
      </span>
      <h3 className="font-display text-xl font-semibold text-paper sm:text-2xl">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>

      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-amber mt-6 px-6 py-3 text-sm">
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionHref && (
        <button onClick={onAction} className="btn-amber mt-6 px-6 py-3 text-sm">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
