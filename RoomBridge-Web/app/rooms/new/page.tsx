"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/common/PageTransition";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import ImageUploader, { PickedImage } from "@/components/rooms/ImageUploader";
import { AMENITY_OPTIONS, POPULAR_CITIES } from "@/types/room";
import type { RoomFormValues } from "@/types/room";
import { apiErrorMessage, createRoom, uploadRoomImages } from "@/services/rooms";

const MAX_PHOTOS = 10;

export default function NewRoomPage() {
  return (
    <ProtectedRoute requireVerified>
      <NewRoomForm />
    </ProtectedRoute>
  );
}

function NewRoomForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [photos, setPhotos] = useState<PickedImage[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<RoomFormValues>({
    mode: "onBlur",
    defaultValues: {
      maxGuests: 2,
      bedrooms: 1,
      bathrooms: 1,
    },
  });

  const goToPhotos = async () => {
    const valid = await trigger([
      "title",
      "description",
      "price",
      "location",
      "city",
      "maxGuests",
      "bedrooms",
      "bathrooms",
    ]);
    if (!valid) return;
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = handleSubmit(async (values) => {
    if (photos.length === 0) {
      setError("Add at least one photo — listings without photos cannot be approved.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const room = await createRoom({ ...values, amenities });
      // The room exists in PENDING before the images land; if the upload fails the
      // host still has the listing and can add photos from their dashboard.
      await uploadRoomImages(room.id, photos.map((p) => p.file), setProgress);
      router.push("/dashboard/listings?submitted=1");
    } catch (err) {
      setError(apiErrorMessage(err, "Could not publish your listing."));
      setSubmitting(false);
    }
  });

  const toggleAmenity = (amenity: string) =>
    setAmenities((current) =>
      current.includes(amenity)
        ? current.filter((a) => a !== amenity)
        : [...current, amenity]
    );

  return (
    <PageTransition>
      <Navbar />
      <main className="min-h-screen bg-ink pb-16 text-paper">
        <div className="relative overflow-hidden border-b border-line">
          <div className="glow -left-24 -top-24 h-64 w-64 opacity-45 sm:h-80 sm:w-80" aria-hidden />
          <div className="relative mx-auto max-w-3xl px-5 pb-7 pt-10 md:px-8 md:pt-14">
            <p className="eyebrow mb-3">List your space</p>
            <h1 className="font-display text-[clamp(1.8rem,7vw,3rem)] font-bold leading-[1.05] tracking-tight text-balance">
              Tell us about your <span className="italic text-amber">place</span>.
            </h1>

            {/* Step rail */}
            <div className="mt-6 flex items-center gap-3">
              <StepDot n={1} active={step === 1} done={step > 1} label="Details" />
              <span className="h-px flex-1 bg-line-strong" />
              <StepDot n={2} active={step === 2} done={false} label="Photos" />
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mx-auto max-w-3xl px-5 py-8 md:px-8">
          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <label className="label" htmlFor="title">
                  Listing title
                </label>
                <input
                  id="title"
                  {...register("title", {
                    required: "Give your listing a title",
                    minLength: { value: 5, message: "At least 5 characters" },
                    maxLength: { value: 120, message: "Keep it under 120 characters" },
                  })}
                  placeholder="Sunlit loft with a private terrace"
                  className={`field ${errors.title ? "field-error" : ""}`}
                />
                <FieldError message={errors.title?.message} />
              </div>

              <div>
                <label className="label" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={5}
                  {...register("description", {
                    required: "Describe your space",
                    minLength: {
                      value: 30,
                      message: "At least 30 characters — guests rely on this",
                    },
                    maxLength: { value: 4000, message: "Keep it under 4000 characters" },
                  })}
                  placeholder="What makes this place special? Mention the neighbourhood, the view, what's nearby…"
                  className={`field resize-y ${errors.description ? "field-error" : ""}`}
                />
                <FieldError message={errors.description?.message} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="city">
                    City
                  </label>
                  <input
                    id="city"
                    list="city-options"
                    {...register("city", {
                      required: "City is required",
                      minLength: { value: 2, message: "At least 2 characters" },
                    })}
                    placeholder="Bangalore"
                    className={`field ${errors.city ? "field-error" : ""}`}
                  />
                  <datalist id="city-options">
                    {POPULAR_CITIES.map((city) => (
                      <option key={city} value={city} />
                    ))}
                  </datalist>
                  <FieldError message={errors.city?.message} />
                </div>

                <div>
                  <label className="label" htmlFor="location">
                    Area / neighbourhood
                  </label>
                  <input
                    id="location"
                    {...register("location", {
                      required: "Area is required",
                      minLength: { value: 2, message: "At least 2 characters" },
                    })}
                    placeholder="Indiranagar"
                    className={`field ${errors.location ? "field-error" : ""}`}
                  />
                  <FieldError message={errors.location?.message} />
                </div>
              </div>

              <div>
                <label className="label" htmlFor="address">
                  Full address <span className="normal-case tracking-normal">(private — shown only after booking)</span>
                </label>
                <input
                  id="address"
                  {...register("address", {
                    maxLength: { value: 300, message: "Address is too long" },
                  })}
                  placeholder="12, 100ft Road, Indiranagar"
                  className={`field ${errors.address ? "field-error" : ""}`}
                />
                <FieldError message={errors.address?.message} />
              </div>

              <div>
                <label className="label" htmlFor="price">
                  Price per night (₹)
                </label>
                <input
                  id="price"
                  type="number"
                  inputMode="numeric"
                  {...register("price", {
                    required: "Set a nightly price",
                    valueAsNumber: true,
                    min: { value: 1, message: "Price must be greater than 0" },
                    max: { value: 1000000, message: "That price looks unrealistic" },
                  })}
                  placeholder="4200"
                  className={`field ${errors.price ? "field-error" : ""}`}
                />
                <FieldError message={errors.price?.message} />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <NumberField
                  id="maxGuests"
                  label="Max guests"
                  register={register("maxGuests", {
                    required: "Required",
                    valueAsNumber: true,
                    min: { value: 1, message: "At least 1" },
                    max: { value: 50, message: "At most 50" },
                  })}
                  error={errors.maxGuests?.message}
                />
                <NumberField
                  id="bedrooms"
                  label="Bedrooms"
                  register={register("bedrooms", {
                    required: "Required",
                    valueAsNumber: true,
                    min: { value: 0, message: "Cannot be negative" },
                    max: { value: 30, message: "At most 30" },
                  })}
                  error={errors.bedrooms?.message}
                />
                <NumberField
                  id="bathrooms"
                  label="Bathrooms"
                  register={register("bathrooms", {
                    required: "Required",
                    valueAsNumber: true,
                    min: { value: 0, message: "Cannot be negative" },
                    max: { value: 30, message: "At most 30" },
                  })}
                  error={errors.bathrooms?.message}
                />
              </div>

              <div>
                <span className="label">Amenities</span>
                <div className="flex flex-wrap gap-2">
                  {AMENITY_OPTIONS.map((amenity) => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`chip ${amenities.includes(amenity) ? "chip-active" : ""}`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={goToPhotos}
                className="btn-amber w-full py-3.5 text-sm sm:w-auto sm:px-8"
              >
                Continue to photos
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="surface-accent rounded-2xl p-4 sm:p-5">
                <p className="text-sm font-medium text-paper">
                  Photos are required for approval
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  Your listing goes to our team for review once you submit. Clear,
                  accurate photos are the fastest route to getting approved.
                </p>
              </div>

              <ImageUploader
                picked={photos}
                onChange={setPhotos}
                max={MAX_PHOTOS}
                disabled={submitting}
              />

              {submitting && progress > 0 && (
                <div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-3">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-hi to-amber-deep transition-[width] duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-center font-mono text-[0.65rem] uppercase tracking-[0.14em] text-faint">
                    Uploading photos… {progress}%
                  </p>
                </div>
              )}

              {error && (
                <p className="rounded-xl border border-[rgb(198_56_44/0.4)] bg-[rgb(198_56_44/0.1)] px-4 py-3 text-sm text-paper">
                  {error}
                </p>
              )}

              <div className="flex flex-col gap-2.5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={submitting}
                  className="btn-ghost py-3.5 text-sm sm:px-8 disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-amber flex-1 py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? "Submitting…" : "Submit for review"}
                </button>
              </div>
            </div>
          )}
        </form>
      </main>
    </PageTransition>
  );
}

function StepDot({
  n,
  active,
  done,
  label,
}: {
  n: number;
  active: boolean;
  done: boolean;
  label: string;
}) {
  return (
    <span className="flex items-center gap-2">
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold transition-colors ${
          active || done
            ? "bg-amber text-[color:var(--btn-amber-fg)]"
            : "border border-line-strong text-faint"
        }`}
      >
        {done ? "✓" : n}
      </span>
      <span
        className={`font-mono text-[0.65rem] uppercase tracking-[0.16em] ${
          active ? "text-paper" : "text-faint"
        }`}
      >
        {label}
      </span>
    </span>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-xs text-[rgb(198_56_44)] dark:text-[rgb(248_141_130)]">
      {message}
    </p>
  );
}

function NumberField({
  id,
  label,
  register,
  error,
}: {
  id: string;
  label: string;
  register: ReturnType<ReturnType<typeof useForm<RoomFormValues>>["register"]>;
  error?: string;
}) {
  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        {...register}
        className={`field ${error ? "field-error" : ""}`}
      />
      <FieldError message={error} />
    </div>
  );
}
