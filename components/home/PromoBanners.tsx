import { homepageConfig } from "@/config/homepage";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import Button from "@/components/ui/Button";
import CountdownTimer from "@/components/home/CountdownTimer";

export default function PromoBanners() {
  const { flashSale, newCollection } = homepageConfig.banners;

  return (
    <section className="py-10 lg:py-14">
      <div className="container-nova grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="relative flex min-h-64 flex-col justify-between overflow-hidden bg-accent p-8">
          <div className="absolute inset-0">
            <ImageWithFallback
              src={flashSale.image}
              alt={flashSale.heading}
              fill
              className="object-cover opacity-20"
            />
          </div>
          <div className="relative">
            <span className="text-xs font-semibold uppercase tracking-widest text-white/80">
              {flashSale.label}
            </span>
            <h3 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              {flashSale.heading}
            </h3>
          </div>
          <div className="relative mt-6 flex flex-wrap items-end justify-between gap-4">
            <CountdownTimer endsAt={flashSale.endsAt} />
            <Button href={flashSale.cta.href} variant="primary" size="md" className="bg-white text-neutral-900 hover:bg-neutral-100">
              {flashSale.cta.label}
            </Button>
          </div>
        </div>

        <div className="relative flex min-h-64 flex-col justify-between overflow-hidden bg-neutral-900 p-8">
          <div className="absolute inset-0">
            <ImageWithFallback
              src={newCollection.image}
              alt={newCollection.heading}
              fill
              className="object-cover opacity-30"
            />
          </div>
          <div className="relative">
            <span className="text-xs font-semibold uppercase tracking-widest text-white/70">
              {newCollection.label}
            </span>
            <h3 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              {newCollection.heading}
            </h3>
          </div>
          <div className="relative mt-6">
            <Button href={newCollection.cta.href} variant="outline" size="md" className="border-white text-white hover:bg-white hover:text-neutral-900">
              {newCollection.cta.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
