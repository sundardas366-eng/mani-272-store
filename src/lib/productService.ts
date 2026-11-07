import fs from "fs";
import path from "path";
import os from "os";
import { PRODUCTS } from "@/data/products";
import type { Product } from "@/types";

declare global {
  var __mani_products_cache: Product[] | undefined;
}

const DATA_DIR =
  process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
    ? os.tmpdir()
    : path.join(process.cwd(), ".data");

const LOCAL_PRODUCTS_FILE = path.join(DATA_DIR, "mani_products.json");

function readProductsFromDisk(): Record<string, Partial<Product>> {
  try {
    if (fs.existsSync(LOCAL_PRODUCTS_FILE)) {
      const data = fs.readFileSync(LOCAL_PRODUCTS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn("Could not read local products override:", err);
  }
  return {};
}

function writeProductsToDisk(overrides: Record<string, Partial<Product>>) {
  try {
    const dir = path.dirname(LOCAL_PRODUCTS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_PRODUCTS_FILE, JSON.stringify(overrides, null, 2));
  } catch (err) {
    console.warn("Failed to write product overrides:", err);
  }
}

/**
 * Returns the 13 products with any dynamic admin overrides (e.g. updated Image URLs).
 */
export function getAllProducts(): Product[] {
  const overrides = readProductsFromDisk();

  return PRODUCTS.map((base) => {
    const override = overrides[base.id] || overrides[base.slug];
    if (override) {
      return {
        ...base,
        ...override,
        updatedAt: override.updatedAt || base.updatedAt,
      };
    }
    return base;
  });
}

/**
 * Finds a single product by ID or Slug.
 */
export function getProductByIdOrSlug(idOrSlug: string): Product | undefined {
  if (!idOrSlug) return undefined;
  const clean = idOrSlug.toLowerCase().trim();
  const all = getAllProducts();

  return all.find(
    (p) =>
      p.id === idOrSlug ||
      p.slug === clean ||
      p.slug === clean.replace(/-panel$/, "") ||
      p.slug + "-panel" === clean
  );
}

/**
 * Updates a product's name, image URL, price, description, or status.
 */
export function updateProduct(
  id: string,
  updates: Partial<Product>
): Product | null {
  const current = getProductByIdOrSlug(id);
  if (!current) return null;

  const overrides = readProductsFromDisk();
  const now = new Date().toISOString();

  overrides[current.id] = {
    ...(overrides[current.id] || {}),
    ...updates,
    updatedAt: now,
  };

  writeProductsToDisk(overrides);

  return {
    ...current,
    ...updates,
    updatedAt: now,
  };
}
