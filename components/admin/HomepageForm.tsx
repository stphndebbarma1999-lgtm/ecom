"use client";

import { useActionState } from "react";
import type { HomepageContent } from "@/types/homepage";
import { updateHomepageAction } from "@/app/admin/(dashboard)/homepage/actions";
import SlideListEditor from "@/components/admin/SlideListEditor";

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

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <SectionCard title="Hero Section (Full-Screen Slider)">
        <p className="-mt-1 text-xs text-neutral-500">
          Recommended photo size — <strong>Desktop: 1920 × 1080px</strong> (landscape). <strong>Mobile:
          1080 × 1920px</strong> (portrait, fills the phone screen). Up to 6 slides; if you only have one
          size, it&apos;s used for both.
        </p>
        <SlideListEditor
          namePrefix="hero"
          countFieldName="heroSlideCount"
          max={6}
          addLabel="+ Add Hero Slide"
          rowGridClassName="sm:grid-cols-[1fr_1fr_auto]"
          initialRows={content.hero.slides as unknown as Record<string, string>[]}
          emptyRow={{ desktop: "", mobile: "" }}
          fields={[
            { key: "desktop", label: "Desktop Photo URL", hint: "1920 × 1080px" },
            { key: "mobile", label: "Mobile Photo URL", hint: "1080 × 1920px" },
          ]}
        />
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
        <input type="hidden" name="categoryCount" value={content.featuredCategories.length} />
        <div className="flex flex-col gap-5">
          {content.featuredCategories.map((category, i) => (
            <div key={i} className="grid grid-cols-1 gap-3 border-b border-neutral-100 pb-5 last:border-0 last:pb-0 sm:grid-cols-3">
              <Field label="Name">
                <input
                  name={`category_${i}_name`}
                  defaultValue={category.name}
                  className={inputClass}
                />
              </Field>
              <Field label="Link">
                <input
                  name={`category_${i}_href`}
                  defaultValue={category.href}
                  className={inputClass}
                />
              </Field>
              <Field label="Image URL" hint="Paste a Sirv photo link here">
                <input
                  name={`category_${i}_image`}
                  defaultValue={category.image}
                  className={inputClass}
                />
              </Field>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Feature Banner Slider (below Shop by Categories)">
        <p className="-mt-1 text-xs text-neutral-500">
          Recommended photo size — <strong>Desktop: 2100 × 900px</strong> (wide banner). <strong>Mobile:
          1280 × 720px</strong>. Leave empty to hide this section; add 2+ slides to make it auto-rotate.
        </p>
        <SlideListEditor
          namePrefix="banner"
          countFieldName="bannerSlideCount"
          max={6}
          addLabel="+ Add Banner Slide"
          rowGridClassName="sm:grid-cols-[1fr_1fr_1fr_auto]"
          initialRows={content.midBannerSlides as unknown as Record<string, string>[]}
          emptyRow={{ desktop: "", mobile: "", href: "/" }}
          fields={[
            { key: "desktop", label: "Desktop Photo URL", hint: "2100 × 900px" },
            { key: "mobile", label: "Mobile Photo URL", hint: "1280 × 720px" },
            { key: "href", label: "Link" },
          ]}
        />
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
