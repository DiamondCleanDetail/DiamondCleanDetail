import { products } from "@/data/products";
import FadeIn from "@/components/FadeIn";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";

function ProductGrid({ items }: { items: typeof products }) {
  return (
    <StaggerGrid className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {items.map((product) => (
        <StaggerItem key={product.slug}>
          <div className="card-lift h-full bg-surface border border-border rounded-xl p-5 flex flex-col">
            <div className="h-32 rounded-lg bg-surface-2 mb-4" />
            <h2 className="font-medium">{product.name}</h2>
            <p className="text-sm text-muted mt-2 flex-1">
              {product.description}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-semibold text-accent">
                ${product.price}
              </span>
              {!product.inStock && (
                <span className="text-xs text-muted">Out of stock</span>
              )}
            </div>
            <button
              disabled={!product.inStock}
              className="chrome-btn mt-4 disabled:bg-none disabled:bg-surface-2 disabled:text-muted disabled:cursor-not-allowed transition-colors py-2 rounded-lg font-semibold text-sm"
            >
              Add to Cart
            </button>
          </div>
        </StaggerItem>
      ))}
    </StaggerGrid>
  );
}

export default function ShopPage() {
  const supplies = products.filter((p) => p.category === "supplies");
  const giftCards = products.filter((p) => p.category === "gift-card");

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <FadeIn>
        <h1 className="text-3xl font-bold mb-2">Shop</h1>
        <p className="text-muted mb-10">
          Detailing products, available for pickup or shipping. Checkout will
          be enabled once payments are connected.
        </p>
      </FadeIn>

      <FadeIn>
        <h2 className="text-xl font-semibold mb-4">Detailing Supplies</h2>
      </FadeIn>
      <ProductGrid items={supplies} />

      <FadeIn>
        <h2 className="text-xl font-semibold mb-4 mt-12">Gift Cards</h2>
      </FadeIn>
      <ProductGrid items={giftCards} />
    </div>
  );
}
