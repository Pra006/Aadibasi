/**
 * Backfills ProductVariant rows for the seeded catalog from the size/price
 * options defined in lib/data.js, and syncs Product.stock to the variant sum.
 *
 * Idempotent — keyed on (productId, name). Run: node prisma/seed-variants.mjs
 */
import { PrismaClient } from "@prisma/client";
import { products as demoProducts } from "../lib/data.js";

const prisma = new PrismaClient();

function variantSku(productSku, productSlug, variantName) {
  const base = (productSku || productSlug).toUpperCase().replace(/[^A-Z0-9]+/g, "-");
  const suffix = variantName.toUpperCase().replace(/[^A-Z0-9]+/g, "");
  return `${base}-${suffix}`;
}

async function main() {
  let created = 0;
  let skipped = 0;

  for (const demo of demoProducts) {
    if (!demo.variants?.length) continue;

    const product = await prisma.product.findUnique({ where: { slug: demo.slug } });
    if (!product) {
      skipped++;
      continue;
    }

    for (const [i, v] of demo.variants.entries()) {
      const sku = variantSku(product.sku, product.slug, v.size);
      const existing = await prisma.productVariant.findUnique({
        where: { productId_name: { productId: product.id, name: v.size } },
      });
      if (existing) continue;

      // A variant SKU must stay globally unique; drop it rather than collide.
      const skuTaken = await prisma.productVariant.findFirst({ where: { sku } });

      await prisma.productVariant.create({
        data: {
          productId: product.id,
          name: v.size,
          sku: skuTaken ? null : sku,
          price: v.price,
          // Preserve the product's discount ratio on the variant where it had one.
          compareAt:
            product.compareAt && product.compareAt > product.retailPrice
              ? Math.round(v.price * (product.compareAt / product.retailPrice))
              : null,
          stock: v.stock,
          images: [],
          isActive: true,
          sortOrder: i,
        },
      });
      created++;
    }

    // Product.stock is the denormalised sum once variants exist.
    const agg = await prisma.productVariant.aggregate({
      where: { productId: product.id },
      _sum: { stock: true },
    });
    await prisma.product.update({
      where: { id: product.id },
      data: { stock: agg._sum.stock ?? 0 },
    });
  }

  console.log(`Variants created: ${created}${skipped ? ` (skipped ${skipped} missing products)` : ""}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
