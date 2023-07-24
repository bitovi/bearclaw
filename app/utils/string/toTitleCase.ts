export function toTitleCase(str: string): string {
  return str
    .replace(/([A-Z]|[0-9]{1,})/g, (match) => ` ${match}`)
    .replace(
      /([0-9]{1,})([a-z])/g,
      (_match, number, letter) => `${number} ${letter}`
    )
    .trim()
    .split(" ")
    .map((word) => {
      return word.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    })
    .join(" ");
}
