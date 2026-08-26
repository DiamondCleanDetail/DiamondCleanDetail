import type { Metadata } from "next";
import { getCategory } from "@/data/catalog";
import WindowTintingClient from "@/components/WindowTintingClient";

const category = getCategory("window-tinting")!;

export const metadata: Metadata = {
  title: category.name,
  description: category.summary,
  openGraph: { title: category.name, description: category.summary },
};

export default function WindowTintingPage() {
  return <WindowTintingClient />;
}
