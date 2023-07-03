import type { EnhancedProperties } from "~/models/rsbomTypes";

export function rateVulnerability(vul: EnhancedProperties[] | undefined) {
  return (
    vul
      ?.reduce<(number | undefined)[]>((acc, curr) => {
        for (const key in curr) {
          if (key.includes("exploitabilityScore")) {
            const _key = key as keyof Pick<
              EnhancedProperties,
              "exploitabilityScore" | "exploitabilityScore3"
            >;

            if (curr[_key] || curr[_key] === 0) {
              return [...acc, curr[_key]];
            }
            return acc;
          }
        }
        return acc;
      }, [])
      .reduce<number>((acc, curr, i, array) => {
        if (i + 1 === array.length) {
          // last entry in the array
          return !!curr || curr === 0
            ? (acc + curr) / array.length
            : acc / array.length;
        }
        return !!curr || curr === 0 ? acc + curr : acc;
      }, 0)
      .toFixed(1)
      .toString() || undefined
  );
}
