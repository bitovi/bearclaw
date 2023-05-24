export const copyText = (text: string | undefined) => {
  if (!text) return;

  navigator.clipboard.writeText(text);
};
