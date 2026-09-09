// Mock catalog data used across the frontend until Phase 2 (Prisma) is wired.
// Images use Unsplash CDN which is reliable for demo use.

const img = (id, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const categories = [
  { slug: "ayurvedic-oils", name: "Ayurvedic Oils", productCount: 42, image: img("photo-1608571423902-eed4a5ad8108") },
  { slug: "herbal-teas", name: "Herbal Teas", productCount: 31, image: img("photo-1594631252845-29fc4cc8cde9") },
  { slug: "handloom-textiles", name: "Handloom Textiles", productCount: 58, image: img("photo-1602858853416-3f97a95c3f80") },
  { slug: "wildcrafted-honey", name: "Wildcrafted Honey", productCount: 18, image: img("photo-1587049352846-4a222e784d38") },
  { slug: "tribal-jewelry", name: "Tribal Jewelry", productCount: 74, image: img("photo-1611085583191-a3b181a88401") },
  { slug: "brass-copperware", name: "Brass & Copperware", productCount: 26, image: img("photo-1610701596007-11502861dcfa") },
  { slug: "incense-resins", name: "Incense & Resins", productCount: 22, image: img("photo-1602928298849-325cec8771c0") },
  { slug: "ceramic-pottery", name: "Ceramic & Pottery", productCount: 34, image: img("photo-1578749556568-bc2c40e68b61") },
];

export const vendors = [
  {
    slug: "himalayan-roots",
    name: "Himalayan Roots",
    logo: img("photo-1620331311520-246422fd82f9", 200),
    banner: img("photo-1518098268026-4e89f1a2cd8e", 1600),
    rating: 4.9,
    reviewCount: 1287,
    productCount: 42,
    location: "Pokhara, Nepal",
    founded: 2016,
    story: "A family cooperative gathering wild botanicals from the middle hills of Nepal — Bhringraj, Manjistha, Neem, and Amla — cold-pressed in kansa cauldrons.",
    verified: true,
  },
  {
    slug: "kathmandu-loom",
    name: "Kathmandu Loom",
    logo: img("photo-1620331311520-246422fd82f9", 200),
    banner: img("photo-1519741497674-611481863552", 1600),
    rating: 4.8,
    reviewCount: 843,
    productCount: 58,
    location: "Bhaktapur, Nepal",
    founded: 2011,
    story: "Handloom weavers reviving traditional Dhaka and Pashmina patterns — dyed with madder root, indigo, and turmeric.",
    verified: true,
  },
  {
    slug: "terai-honey-co",
    name: "Terai Honey Co.",
    logo: img("photo-1587049352846-4a222e784d38", 200),
    banner: img("photo-1550684848-fac1c5b4e853", 1600),
    rating: 4.9,
    reviewCount: 512,
    productCount: 18,
    location: "Chitwan, Nepal",
    founded: 2019,
    story: "Ethical beekeepers of the Terai lowlands, producing raw multi-floral, mustard, and mad honey in single-origin batches.",
    verified: true,
  },
  {
    slug: "annapurna-artisans",
    name: "Annapurna Artisans",
    logo: img("photo-1611085583191-a3b181a88401", 200),
    banner: img("photo-1560343090-f0409e92791a", 1600),
    rating: 4.7,
    reviewCount: 621,
    productCount: 74,
    location: "Lalitpur, Nepal",
    founded: 2014,
    story: "Silver and brass metalsmiths continuing a five-generation lineage of ritual objects and heirloom jewelry.",
    verified: true,
  },
];

export const products = [
  {
    id: "p1",
    slug: "maha-bhringraj-hair-oil-200ml",
    name: "Maha Bhringraj Hair Oil",
    shortDescription: "21-day slow-decocted with 28 wildcrafted botanicals for deep follicular vitality.",
    description:
      "A classical Vedic formulation crafted in kansa cauldrons over 21 days. Cold-pressed sesame carrier infused with wildcrafted Bhringraj, Amla, Brahmi, and 25 other rare Himalayan botanicals. Massaged into the scalp weekly, it nourishes roots, calms Pitta, and encourages dense, glossy hair growth.",
    vendor: "himalayan-roots",
    category: "ayurvedic-oils",
    brand: "Himalayan Roots",
    price: 1499,
    compareAt: 1999,
    stock: 42,
    rating: 4.9,
    reviewCount: 428,
    tags: ["hair", "ayurvedic", "wildcrafted"],
    images: [
      img("photo-1608571423902-eed4a5ad8108"),
      img("photo-1608571422747-5b21b0a04e13"),
      img("photo-1608571422893-4e5edb2b7a86"),
      img("photo-1608572253841-c4ce9c58ab1f"),
    ],
    variants: [
      { id: "v1", size: "100ml", price: 899, stock: 30 },
      { id: "v2", size: "200ml", price: 1499, stock: 42 },
      { id: "v3", size: "500ml", price: 3299, stock: 12 },
    ],
    featured: true,
    trending: true,
  },
  {
    id: "p2",
    slug: "dhaka-handloom-shawl-indigo",
    name: "Dhaka Handloom Shawl — Indigo",
    shortDescription: "Hand-woven Dhaka pattern shawl, naturally dyed with wild indigo.",
    description:
      "Woven on a traditional pit loom in Bhaktapur, this Dhaka shawl carries geometric motifs passed through generations. Naturally dyed with wild indigo harvested from the Terai. Each shawl is signed by its weaver.",
    vendor: "kathmandu-loom",
    category: "handloom-textiles",
    brand: "Kathmandu Loom",
    price: 4200,
    compareAt: 5500,
    stock: 12,
    rating: 4.8,
    reviewCount: 92,
    tags: ["textile", "handloom", "gift"],
    images: [
      img("photo-1519741497674-611481863552"),
      img("photo-1602858853416-3f97a95c3f80"),
      img("photo-1544441892-794166f1e3be"),
    ],
    variants: [
      { id: "v1", size: "Standard", price: 4200, stock: 12 },
      { id: "v2", size: "Oversize", price: 5100, stock: 6 },
    ],
    featured: true,
  },
  {
    id: "p3",
    slug: "raw-multiflora-honey-500g",
    name: "Raw Multi-Floral Honey",
    shortDescription: "Single-origin, unheated honey from the Chitwan forest floor.",
    description:
      "Harvested from wild Apis cerana colonies deep in the Chitwan buffer zone. Unheated, unfiltered, crystallizes naturally in cool weather — a mark of raw purity.",
    vendor: "terai-honey-co",
    category: "wildcrafted-honey",
    brand: "Terai Honey Co.",
    price: 1250,
    compareAt: 1500,
    stock: 60,
    rating: 4.9,
    reviewCount: 214,
    tags: ["honey", "raw", "single-origin"],
    images: [
      img("photo-1587049352846-4a222e784d38"),
      img("photo-1550684848-fac1c5b4e853"),
      img("photo-1587049633312-d628ae50a8ae"),
    ],
    variants: [
      { id: "v1", size: "250g", price: 700, stock: 40 },
      { id: "v2", size: "500g", price: 1250, stock: 60 },
      { id: "v3", size: "1kg", price: 2350, stock: 22 },
    ],
    featured: true,
    trending: true,
  },
  {
    id: "p4",
    slug: "sterling-silver-lotus-earrings",
    name: "Sterling Silver Lotus Earrings",
    shortDescription: "Handcrafted 925 silver — a Newari lotus motif.",
    description:
      "Cast and finished by Annapurna Artisans in Lalitpur, these earrings render the sacred lotus in 92.5% sterling silver. Each pair carries the maker's hallmark.",
    vendor: "annapurna-artisans",
    category: "tribal-jewelry",
    brand: "Annapurna Artisans",
    price: 2800,
    compareAt: 3600,
    stock: 24,
    rating: 4.7,
    reviewCount: 138,
    tags: ["silver", "jewelry", "gift"],
    images: [
      img("photo-1611085583191-a3b181a88401"),
      img("photo-1535632066927-ab7c9ab60908"),
      img("photo-1573408301185-9146fe634ad0"),
    ],
    variants: [{ id: "v1", size: "One size", price: 2800, stock: 24 }],
    featured: true,
  },
  {
    id: "p5",
    slug: "brahmi-tulsi-herbal-tea",
    name: "Brahmi Tulsi Herbal Tea",
    shortDescription: "Calming daily blend — Brahmi, Holy Basil, Cardamom.",
    description: "A daily calming infusion combining Brahmi for clarity, Tulsi for immunity, and green cardamom for warmth.",
    vendor: "himalayan-roots",
    category: "herbal-teas",
    brand: "Himalayan Roots",
    price: 650,
    compareAt: 800,
    stock: 88,
    rating: 4.8,
    reviewCount: 172,
    tags: ["tea", "herbal"],
    images: [img("photo-1594631252845-29fc4cc8cde9"), img("photo-1576092768241-dec231879fc3")],
    variants: [
      { id: "v1", size: "50g", price: 400, stock: 50 },
      { id: "v2", size: "100g", price: 650, stock: 88 },
    ],
    trending: true,
  },
  {
    id: "p6",
    slug: "copper-water-bottle-750ml",
    name: "Hammered Copper Water Bottle",
    shortDescription: "Ayurvedic hydration — hand-hammered 99.5% copper.",
    description: "Following the Ayurvedic practice of tamra jal — water stored in copper overnight for gentle mineral enrichment.",
    vendor: "annapurna-artisans",
    category: "brass-copperware",
    brand: "Annapurna Artisans",
    price: 1650,
    compareAt: 2100,
    stock: 34,
    rating: 4.6,
    reviewCount: 89,
    tags: ["copper", "wellness"],
    images: [img("photo-1610701596007-11502861dcfa"), img("photo-1602928298849-325cec8771c0")],
    variants: [
      { id: "v1", size: "500ml", price: 1250, stock: 30 },
      { id: "v2", size: "750ml", price: 1650, stock: 34 },
      { id: "v3", size: "1L", price: 1950, stock: 18 },
    ],
  },
  {
    id: "p7",
    slug: "sandalwood-frankincense-incense",
    name: "Sandalwood & Frankincense Incense",
    shortDescription: "Hand-rolled temple-grade incense sticks.",
    description: "Rolled by hand on bamboo cores with pure sandalwood powder and Omani frankincense resin.",
    vendor: "himalayan-roots",
    category: "incense-resins",
    brand: "Himalayan Roots",
    price: 350,
    compareAt: 480,
    stock: 120,
    rating: 4.7,
    reviewCount: 231,
    tags: ["incense", "ritual"],
    images: [img("photo-1602928298849-325cec8771c0"), img("photo-1600804887253-8a2fdc19c96c")],
    variants: [{ id: "v1", size: "20 sticks", price: 350, stock: 120 }],
  },
  {
    id: "p8",
    slug: "black-clay-serving-bowl",
    name: "Black Clay Serving Bowl",
    shortDescription: "Wood-fired earthen bowl — Bhaktapur pottery.",
    description: "Thrown on a stone wheel and wood-fired in a traditional bhatta kiln, each bowl carries the unrepeatable marks of ash and flame.",
    vendor: "kathmandu-loom",
    category: "ceramic-pottery",
    brand: "Kathmandu Loom",
    price: 890,
    compareAt: 1200,
    stock: 40,
    rating: 4.5,
    reviewCount: 47,
    tags: ["pottery", "home"],
    images: [img("photo-1578749556568-bc2c40e68b61"), img("photo-1610702093903-c0f0b48b6c5a")],
    variants: [{ id: "v1", size: "Medium", price: 890, stock: 40 }],
  },
];

export const flashSaleEndsAt = new Date(Date.now() + 1000 * 60 * 60 * 26).toISOString();

export function getProduct(slug) {
  return products.find((p) => p.slug === slug);
}
export function getVendor(slug) {
  return vendors.find((v) => v.slug === slug);
}
export function getCategory(slug) {
  return categories.find((c) => c.slug === slug);
}
export function productsByVendor(vendorSlug) {
  return products.filter((p) => p.vendor === vendorSlug);
}
export function productsByCategory(catSlug) {
  return products.filter((p) => p.category === catSlug);
}
export function featuredProducts() {
  return products.filter((p) => p.featured);
}
export function trendingProducts() {
  return products.filter((p) => p.trending);
}
