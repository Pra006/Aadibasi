"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

const slides = [
  {
    eyebrow: "Nepal's Heritage Marketplace",
    title: "Ancient Wisdom.",
    italic: "Rooted in Nature.",
    body:
      "Discover ancestral Ayurvedic formulations, handloom textiles, wildcrafted honey, and heirloom craft — direct from Nepal's most respected artisan cooperatives.",
    ctaText: "Shop the Collection",
    ctaHref: "/shop",
    secondaryText: "Meet the Makers",
    secondaryHref: "/stores",
    // Nepal Himalaya
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80",
    badgeIcon: "spa",
    tag: "Ayurvedic Wellness",
  },
  {
    eyebrow: "Wildcrafted from the Hills",
    title: "28 Sacred Botanicals.",
    italic: "Cold-pressed slowly.",
    body:
      "Bhringraj, Amla, Brahmi, and Neem — hand-harvested from the middle hills and slow-decocted in kansa cauldrons the way our grandmothers did.",
    ctaText: "Explore Ayurvedic Oils",
    ctaHref: "/categories/ayurvedic-oils",
    secondaryText: "Read the Story",
    secondaryHref: "/about",
    // Herbs / oil bottles
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1600&q=80",
    badgeIcon: "eco",
    tag: "AYUSH Certified",
  },
  {
    eyebrow: "Handloom Since Generations",
    title: "Woven in Bhaktapur.",
    italic: "Signed by the weaver.",
    body:
      "Dhaka and Pashmina shawls dyed with wild indigo, madder root, and turmeric. Every piece is signed by the hand that wove it.",
    ctaText: "Shop Handloom",
    ctaHref: "/categories/handloom-textiles",
    secondaryText: "Visit Kathmandu Loom",
    secondaryHref: "/stores/kathmandu-loom",
    // Nepali textile
    image:
      "https://images.unsplash.com/photo-1602858853416-3f97a95c3f80?auto=format&fit=crop&w=1600&q=80",
    badgeIcon: "checkroom",
    tag: "Handloom Nepal",
  },
  {
    eyebrow: "Ethical Beekeeping",
    title: "Raw Honey.",
    italic: "From wild Terai forests.",
    body:
      "Unheated, unfiltered, single-origin — mustard, multi-floral, and rare mad honey harvested by ethical beekeepers of the Terai lowlands.",
    ctaText: "Taste Wildcrafted Honey",
    ctaHref: "/categories/wildcrafted-honey",
    secondaryText: "Meet the Beekeepers",
    secondaryHref: "/stores/terai-honey-co",
    // Honey / jars
    image:
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1600&q=80",
    badgeIcon: "hive",
    tag: "Single-Origin",
  },
];

const AUTOPLAY_MS = 5500;

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((n) => setIndex((n + slides.length) % slides.length), []);
  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <section
      className="relative w-full overflow-hidden bg-forest-deep text-ivory-canvas"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Aadibasi featured collections"
    >
      {/* Slides */}
      <div className="relative h-[520px] sm:h-[560px] lg:h-[620px]">
        {slides.map((s, i) => {
          const active = i === index;
          return (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                active ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
              aria-hidden={!active}
            >
              {/* Image */}
              <img
                src={s.image}
                alt=""
                className={`absolute inset-0 w-full h-full object-cover ${
                  active ? "animate-slow-zoom" : ""
                }`}
              />
              {/* Overlays: darken on left for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-forest-deep/85 via-forest-deep/55 to-forest-deep/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/70 via-transparent to-transparent" />

              {/* Content */}
              <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-12 flex items-center">
                <div className="max-w-2xl">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ivory-canvas/10 border border-antique-gold/40 backdrop-blur-sm mb-5 transition-all duration-700 delay-100 ${
                      active ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                    }`}
                  >
                    <Icon name={s.badgeIcon} size={16} className="text-antique-gold" />
                    <span className="text-[11px] uppercase tracking-widest font-semibold text-earth-sand">
                      {s.eyebrow}
                    </span>
                  </div>
                  <h1
                    className={`font-headline text-4xl sm:text-5xl lg:text-[62px] leading-[1.05] tracking-tight text-ivory-canvas transition-all duration-700 delay-200 ${
                      active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                  >
                    {s.title}
                    <br />
                    <span className="italic text-antique-gold font-normal">{s.italic}</span>
                  </h1>
                  <p
                    className={`mt-5 text-base sm:text-lg text-earth-sand/90 leading-relaxed max-w-xl transition-all duration-700 delay-300 ${
                      active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                  >
                    {s.body}
                  </p>
                  <div
                    className={`mt-8 flex flex-wrap items-center gap-3 transition-all duration-700 delay-500 ${
                      active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                  >
                    <Link
                      href={s.ctaHref}
                      className="inline-flex items-center gap-2 bg-antique-gold text-forest-deep px-7 py-3.5 rounded font-semibold text-sm sm:text-base shadow-lg hover:brightness-95 transition"
                    >
                      {s.ctaText}
                      <Icon name="arrow_forward" size={18} />
                    </Link>
                    <Link
                      href={s.secondaryHref}
                      className="inline-flex items-center gap-2 bg-transparent text-ivory-canvas px-6 py-3.5 rounded font-semibold text-sm sm:text-base border border-ivory-canvas/40 hover:bg-ivory-canvas/10 transition"
                    >
                      {s.secondaryText}
                    </Link>
                  </div>

                  {/* Tag pill */}
                  <div
                    className={`mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-deep/70 border border-antique-gold/30 backdrop-blur-sm transition-all duration-700 delay-500 ${
                      active ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Icon name="verified" size={14} className="text-antique-gold" />
                    <span className="text-[11px] uppercase tracking-widest text-earth-sand font-semibold">
                      {s.tag}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="hidden sm:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-ivory-canvas/15 hover:bg-ivory-canvas/30 border border-ivory-canvas/30 backdrop-blur items-center justify-center text-ivory-canvas transition"
      >
        <Icon name="chevron_left" size={22} />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="hidden sm:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-ivory-canvas/15 hover:bg-ivory-canvas/30 border border-ivory-canvas/30 backdrop-blur items-center justify-center text-ivory-canvas transition"
      >
        <Icon name="chevron_right" size={22} />
      </button>

      {/* Dots + progress */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, i) => {
          const active = i === index;
          return (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="group flex items-center"
            >
              <span
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  active
                    ? "w-10 bg-antique-gold"
                    : "w-4 bg-ivory-canvas/40 group-hover:bg-ivory-canvas/70"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Slide counter */}
      <div className="absolute top-6 right-6 z-20 text-[11px] font-semibold uppercase tracking-widest text-earth-sand/80 bg-forest-deep/50 backdrop-blur px-3 py-1.5 rounded-full border border-antique-gold/20">
        {String(index + 1).padStart(2, "0")}{" "}
        <span className="text-antique-gold/70">/</span>{" "}
        {String(slides.length).padStart(2, "0")}
      </div>
    </section>
  );
}
