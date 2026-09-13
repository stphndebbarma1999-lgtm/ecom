"use client";

import { useActionState } from "react";
import type { HomepageContent } from "@/types/homepage";
import { updateHomepageAction } from "@/app/admin/(dashboard)/homepage/actions";

const inputClass =
  "border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-900";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-neutral-700">{label}</span>
      {children}
      {hint && <span className="text-xs text-neutral-400">{hint}</span>}
    </label>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-neutral-200 bg-white p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-900">
        {title}
      </h2>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

export default function HomepageForm({ content }: { content: HomepageContent }) {
  const [state, formAction, pending] = useActionState(updateHomepageAction, {});

  const heroImagesText = content.hero.images.join("\n");
  const featuredCategoriesText = content.featuredCategories
    .map((c) => `${c.name}|${c.href}|${c.image}`)
    .join("\n");
  const midBannerSlidesText = content.midBannerSlides
    .map((s) => `${s.image}|${s.href}`)
    .join("\n");

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <SectionCard title="Hero Section (Full-Screen Slider)">
        <Field
          label="Hero Slider Images"
          hint="One Sirv URL per line — up to 5-6 photos. They fill the screen and auto-rotate with no text overlay; leave blank for a placeholder."
        >
          <textarea
            name="heroImages"
            rows={6}
            defaultValue={heroImagesText}
            className={inputClass}
          />
        </Field>
      </SectionCard>

      <SectionCard title="Flash Sale Banner">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Label">
            <input
              name="flashSaleLabel"
              defaultValue={content.banners.flashSale.label}
              className={inputClass}
            />
          </Field>
          <Field label="Heading">
            <input
              name="flashSaleHeading"
              defaultValue={content.banners.flashSale.heading}
              className={inputClass}
            />
          </Field>
          <Field label="Button Text">
            <input
              name="flashSaleCtaLabel"
              defaultValue={content.banners.flashSale.cta.label}
              className={inputClass}
            />
          </Field>
          <Field label="Button Link">
            <input
              name="flashSaleCtaHref"
              defaultValue={content.banners.flashSale.cta.href}
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="Background Image" hint="Sirv URL — leave blank for a plain color background">
          <input
            name="flashSaleImage"
            defaultValue={content.banners.flashSale.image}
            className={inputClass}
          />
        </Field>
        <Field label="Countdown Ends At" hint="Optional — leave blank for a rolling ~2 day countdown">
          <input
            type="datetime-local"
            name="flashSaleEndsAt"
            defaultValue={content.banners.flashSale.endsAt}
            className={inputClass}
          />
        </Field>
      </SectionCard>

      <SectionCard title="New Collection Banner">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Label">
            <input
              name="newCollectionLabel"
              defaultValue={content.banners.newCollection.label}
              className={inputClass}
            />
          </Field>
          <Field label="Heading">
            <input
              name="newCollectionHeading"
              defaultValue={content.banners.newCollection.heading}
              className={inputClass}
            />
          </Field>
          <Field label="Button Text">
            <input
              name="newCollectionCtaLabel"
              defaultValue={content.banners.newCollection.cta.label}
              className={inputClass}
            />
          </Field>
          <Field label="Button Link">
            <input
              name="newCollectionCtaHref"
              defaultValue={content.banners.newCollection.cta.href}
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="Background Image" hint="Sirv URL — leave blank for a plain color background">
          <input
            name="newCollectionImage"
            defaultValue={content.banners.newCollection.image}
            className={inputClass}
          />
        </Field>
      </SectionCard>

      <SectionCard title="Shop by Categories Tiles">
        <Field
          label="Categories"
          hint='One per line, format "Name|Link|ImageURL" — e.g. Men|/men|https://...'
        >
          <textarea
            name="featuredCategories"
            rows={8}
            defaultValue={featuredCategoriesText}
            className={inputClass}
          />
        </Field>
      </SectionCard>

      <SectionCard title="Feature Banner Slider (below Shop by Categories)">
        <Field
          label="Banner Slides"
          hint='One per line, format "ImageURL|LinkURL" — e.g. https://.../sale.jpg|/new-arrivals. Leave blank to hide this section; add 2+ lines to make it auto-rotate.'
        >
          <textarea
            name="midBannerSlides"
            rows={5}
            defaultValue={midBannerSlidesText}
            className={inputClass}
          />
        </Field>
      </SectionCard>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.success && <p className="text-sm text-emerald-600">Homepage updated.</p>}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 w-fit items-center justify-center bg-neutral-900 px-6 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
