import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";
import SectionHeading from "@/components/SectionHeading";
import DiamondDivider from "@/components/DiamondDivider";
import ShopClient from "@/components/ShopClient";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Diamond Clean Detail gift cards and detailing supplies — the same products we use, plus gift cards redeemable against any service.",
};

export default function ShopPage() {
  return (
    <div>
      <section className="mx-auto max-w-4xl px-6 pt-10 sm:pt-16 pb-8 sm:pb-12 text-center">
        <FadeIn>
          <SectionHeading
            as="h1"
            eyebrow="Shop"
            title="Gift Cards &"
            accent="Supplies"
            subtitle="Give the gift of a spotless car, or pick up the same products we use between details. Gift cards arrive by email; supplies ship to your door."
          />
        </FadeIn>
      </section>

      <DiamondDivider />

      <section className="mx-auto max-w-6xl px-6 pt-10 sm:pt-14">
        <ShopClient products={products} />
      </section>
    </div>
  );
}
