export const rateSeverity = (rating: string) => {
  const num = parseInt(rating);
  if (num >= 5) {
    return "highSeverityCVE";
  }
  if (num < 5 && num >= 3) {
    return "mediumSeverityCVE";
  }
  return "lowSeverityCVE";
};
