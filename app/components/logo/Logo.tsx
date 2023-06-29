import { VariantInline } from "./VariantInline.svg";
import { VariantStacked } from "./VariantStacked.svg";

type Props = {
  variant?: "inline" | "stacked";
  width?: string;
  color?: string;
};

export function Logo({ color, variant, width }: Props) {
  if (variant === "stacked") {
    return <VariantStacked width={width} color={color} />;
  }
  return <VariantInline width={width} color={color} />;
}
