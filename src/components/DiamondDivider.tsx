import Image from "next/image";

export default function DiamondDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-2" aria-hidden>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-border" />
      <Image src="/brand/logo.png" alt="" width={22} height={22} className="h-[22px] w-[22px] shrink-0" />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-border" />
    </div>
  );
}
