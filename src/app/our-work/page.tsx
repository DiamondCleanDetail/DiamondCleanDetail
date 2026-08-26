import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";
import WorkGallery from "@/components/WorkGallery";

export const metadata: Metadata = {
  title: "Our Work",
  description: "A look at recent detailing jobs from Diamond Clean Detail, straight from real customers.",
};

export default function OurWorkPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:py-16">
      <FadeIn>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Our Work</h1>
        <p className="text-sm sm:text-base text-muted mb-6 sm:mb-10">
          A look at recent jobs, straight from real customers. Tap any photo to
          see it full size.
        </p>
      </FadeIn>

      <WorkGallery />
    </div>
  );
}
