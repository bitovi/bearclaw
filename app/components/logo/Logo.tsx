import { VariantInline } from "./VariantInline.svg";
import { VariantStacked } from "./VariantStacked.svg";

type Props = {
  variant?: "inline" | "stacked";
  width?: string;
  imageColor?: string;
  textColor?: string;
};

export function Logo({ textColor, imageColor, variant, width }: Props) {
  if (variant === "stacked") {
    return (
      <VariantStacked
        width={width}
        imageColor={imageColor}
        textColor={textColor}
      />
    );
  }
  return (
    <VariantInline
      width={width}
      imageColor={imageColor}
      textColor={textColor}
    />
  );
}
