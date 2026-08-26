"use client";

import { useEffect } from "react";

/** Clears the in-progress booking draft once the customer actually reaches
 * a confirmed outcome — renders nothing. */
export default function ClearBookingDraft() {
  useEffect(() => {
    try {
      sessionStorage.removeItem("dcd-booking-draft");
    } catch {
      // non-fatal
    }
  }, []);
  return null;
}
