export const rateSeverity = (rating: string) => {
  const num = parseInt(rating);
  if (num >= 5) {
    return "HIGH";
  }
  if (num < 5 && num >= 3) {
    return "MEDIUM";
  }
  return "LOW";
};
