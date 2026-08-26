/** Colorado window tint law (C.R.S. § 42-4-227), general reference only. */
export const coTintLaw = {
  minVltPercent: 27,
  rules: [
    { area: "Windshield", rule: "Non-reflective tint allowed on the top 4 inches only." },
    { area: "Front side windows", rule: "Must allow more than 27% of light in." },
    { area: "Back side windows", rule: "Must allow more than 27% of light in." },
    { area: "Rear window", rule: "Must allow more than 27% of light in." },
    { area: "Reflectivity", rule: "Tint may not be more than 25% reflective." },
  ],
  note:
    "Medical exemptions are available with proper documentation. Laws can change and enforcement varies by vehicle — this is general guidance, not legal advice. We'll always confirm current requirements with you before install.",
};

/** Whether a given VLT percentage clears Colorado's 27% minimum for road use. */
export function isRoadLegalInColorado(vltPercent: number): boolean {
  return vltPercent > coTintLaw.minVltPercent;
}
