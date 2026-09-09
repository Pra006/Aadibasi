import Icon from "@/components/ui/Icon";
import Rating from "@/components/ui/Rating";
import Button from "@/components/ui/Button";

const sample = [
  {
    name: "Priya Adhikari",
    when: "2 weeks ago",
    rating: 5,
    verified: true,
    title: "Genuinely feels ancestral.",
    body: "You can smell the herbs the moment you open the bottle — this isn't a supermarket oil. Two weeks in, less breakage, calmer scalp.",
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=200&q=70",
      "https://images.unsplash.com/photo-1608572253841-c4ce9c58ab1f?auto=format&fit=crop&w=200&q=70",
    ],
  },
  {
    name: "Bishal Rai",
    when: "1 month ago",
    rating: 4,
    verified: true,
    title: "Slow but real results.",
    body: "Not a quick fix — I gave it 6 weeks. Hair definitely feels denser, and I trust what's on the label. The wooden box packaging is a lovely touch.",
  },
  {
    name: "Anita S.",
    when: "2 months ago",
    rating: 5,
    verified: true,
    title: "Worth every rupee.",
    body: "Bought after my grandmother recommended it. She was right, of course.",
  },
];

export default function ReviewList({ productRating = 4.8, count = 428 }) {
  return (
    <div>
      <h2 className="font-headline text-2xl text-forest-deep">Reviews</h2>
      <div className="mt-4 grid sm:grid-cols-[220px_1fr] gap-6 items-start">
        <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-center">
          <div className="font-headline text-5xl text-forest-deep">{productRating.toFixed(1)}</div>
          <div className="flex justify-center mt-1">
            <Rating value={productRating} showCount={false} />
          </div>
          <p className="text-xs text-on-surface-variant mt-1">{count.toLocaleString()} reviews</p>
          <Button size="sm" variant="secondary" className="mt-4 w-full">Write a review</Button>
        </div>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((r) => (
            <div key={r} className="flex items-center gap-3 text-xs">
              <span className="w-4 font-semibold text-forest-deep">{r}</span>
              <Icon name="star" size={14} className="text-antique-gold" filled />
              <div className="flex-1 h-2 rounded-full bg-surface-container-high overflow-hidden">
                <div
                  className="h-full bg-antique-gold"
                  style={{ width: `${r === 5 ? 72 : r === 4 ? 18 : r === 3 ? 6 : r === 2 ? 3 : 1}%` }}
                />
              </div>
              <span className="text-on-surface-variant w-10 text-right">
                {r === 5 ? "72%" : r === 4 ? "18%" : r === 3 ? "6%" : r === 2 ? "3%" : "1%"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 divide-y divide-outline-variant/60">
        {sample.map((r, i) => (
          <article key={i} className="py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-forest-base text-antique-gold flex items-center justify-center font-semibold">
                {r.name[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-forest-deep">{r.name}</span>
                  {r.verified && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] uppercase tracking-widest text-herbal-jade font-bold">
                      <Icon name="verified" size={12} /> Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <Rating value={r.rating} showCount={false} size={12} />
                  <span className="text-xs text-on-surface-variant">{r.when}</span>
                </div>
              </div>
            </div>
            <h4 className="mt-3 font-semibold text-forest-deep">{r.title}</h4>
            <p className="mt-1 text-sm text-on-surface-variant leading-relaxed">{r.body}</p>
            {r.images && (
              <div className="mt-3 flex gap-2">
                {r.images.map((src, j) => (
                  <img key={j} src={src} className="w-16 h-16 rounded-lg object-cover" alt="" />
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
