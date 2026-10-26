import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { categories, products } from "./schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is missing from your .env.local file configuration.",
  );
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle({ client: sql });

async function main() {
  console.log("🏁 Initiating database seeding process...");

  try {
    console.log(
      "📦 Injecting category structures (with conflict resolution)...",
    );

    await db
      .insert(categories)
      .values([
        {
          name: "Natural Remedies & Powders",
          slug: "natural-remedies-powders",
        },
        {
          name: "Cold-Pressed Remedial Oils",
          slug: "cold-pressed-remedial-oils",
        },
        {
          name: "Lifestyle Health Literature",
          slug: "lifestyle-health-literature",
        },
      ])
      .onConflictDoNothing({ target: categories.name })
      .returning({ id: categories.id, name: categories.name });

    const allCategories = await db
      .select({ id: categories.id, name: categories.name })
      .from(categories);

    const remedyCat = allCategories.find(
      (c) => c.name === "Natural Remedies & Powders",
    );
    const oilCat = allCategories.find(
      (c) => c.name === "Cold-Pressed Remedial Oils",
    );
    const bookCat = allCategories.find(
      (c) => c.name === "Lifestyle Health Literature",
    );

    if (!remedyCat || !oilCat || !bookCat) {
      throw new Error("Category mapping verification failed.");
    }

    console.log("🌿 Populating products catalog ledger with compliant copy...");
    await db
      .insert(products)
      .values([
        {
          categoryId: remedyCat.id,
          name: "Activated Charcoal Powder (Premium Grade)",
          slug: "activated-charcoal-powder-premium",
          description:
            "Pure, food-grade activated charcoal powder. Supports digestive comfort, overall wellness, and natural cleansing applications.",
          priceKes: "1200.00",
          stockQuantity: 50,
          weightGrams: 250,
          imageUrl: "https://unsplash.com",
          isActive: true,
        },
        {
          categoryId: remedyCat.id,
          name: "Pure Cayenne Pepper Powder (90,000 HU)",
          slug: "pure-cayenne-pepper-powder-90000",
          description:
            "High-heating traditional cayenne pepper. Supports healthy circulation, dynamic metabolic balance, and serves as a natural systemic warming herb.",
          priceKes: "850.00",
          stockQuantity: 40,
          weightGrams: 150,
          imageUrl: "https://unsplash.com",
          isActive: true,
        },
        {
          categoryId: oilCat.id,
          name: "Cold-Pressed Pure Garlic Oil",
          slug: "cold-pressed-pure-garlic-oil",
          description:
            "Extract of organic garlic bulbs. Rich in traditional botanical compounds that support immune vitality and cardiovascular health.",
          priceKes: "1800.00",
          stockQuantity: 30,
          weightGrams: 100,
          imageUrl: "https://unsplash.com",
          isActive: true,
        },
        {
          categoryId: bookCat.id,
          name: "The Ministry of Healing (Original Landmark Edition)",
          slug: "ministry-of-healing-original",
          description:
            "The historical guide exploring lifestyle transformations, dietary principles, mental wellness, and the simple laws of natural health.",
          priceKes: "1500.00",
          stockQuantity: 100,
          weightGrams: 450,
          imageUrl: "https://unsplash.com",
          isActive: true,
        },
      ])
      .onConflictDoNothing({ target: products.slug });

    console.log(
      "✅ Database seeding finished successfully! Store catalog populated.",
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding operations execution failed:", error);
    process.exit(1);
  }
}

main();
