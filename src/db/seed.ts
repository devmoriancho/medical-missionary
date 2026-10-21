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
const db = drizzle(sql);

async function main() {
  console.log("🏁 Initiating database seeding process...");

  try {
    console.log("📦 Injecting category structures...");
    const insertedCategories = await db
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
      .returning({ id: categories.id, name: categories.name });

    const remedyCat = insertedCategories.find(
      (c) => c.name === "Natural Remedies & Powders",
    );
    const oilCat = insertedCategories.find(
      (c) => c.name === "Cold-Pressed Remedial Oils",
    );
    const bookCat = insertedCategories.find(
      (c) => c.name === "Lifestyle Health Literature",
    );

    if (!remedyCat || !oilCat || !bookCat)
      throw new Error("Category mapping failed.");

    console.log("🌿 Flooding products catalog ledger...");
    await db.insert(products).values([
      {
        categoryId: remedyCat.id,
        name: "Activated Charcoal Powder (Premium Grade)",
        slug: "activated-charcoal-powder-premium",
        description:
          "Pure, medicinal-grade activated charcoal powder. Highly effective for systemic detoxification, digestive relief, and natural remedy applications.",
        priceKes: "1200.00",
        stockQuantity: 50,
        weightGrams: 250,
        imageUrl: "https://cloudinary.com",
        isActive: true,
      },
      {
        categoryId: remedyCat.id,
        name: "Pure Cayenne Pepper Powder (90,000 HU)",
        slug: "pure-cayenne-pepper-powder-90000",
        description:
          "High-heating therapeutic cayenne pepper. Promotes optimal blood circulation, cardiovascular health, and acts as an immediate systemic catalyst.",
        priceKes: "850.00",
        stockQuantity: 40,
        weightGrams: 150,
        imageUrl: "https://cloudinary.com",
        isActive: true,
      },
      {
        categoryId: oilCat.id,
        name: "Cold-Pressed Pure Garlic Oil",
        slug: "cold-pressed-pure-garlic-oil",
        description:
          "Extract of organic garlic bulbs. Powerful natural antimicrobial, immunity shield, and supports healthy blood pressure regulation.",
        priceKes: "1800.00",
        stockQuantity: 30,
        weightGrams: 100,
        imageUrl: "https://cloudinary.com",
        isActive: true,
      },
      {
        categoryId: bookCat.id,
        name: "The Ministry of Healing (Original Landmark Edition)",
        slug: "ministry-of-healing-original",
        description:
          "The blueprint guide to natural lifestyle transformations, diet, mental health, and the application of simple, god-given natural laws of cure.",
        priceKes: "1500.00",
        stockQuantity: 100,
        weightGrams: 450,
        imageUrl: "https://cloudinary.com",
        isActive: true,
      },
    ]);

    console.log(
      "✅ Database seeding finished successfully! All shelving units populated.",
    );
  } catch (error) {
    console.error("❌ Seeding operations execution failed:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();
