import { VariantInline } from "./VariantInline.svg";
import { VariantStacked } from "./VariantStacked.svg";
import { VariantImageOnly } from "./VariantImageOnly.svg";
type Props = {
  variant?: "inline" | "stacked" | "imageOnly";
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
  if (variant === "imageOnly") {
    return <VariantImageOnly width={width} imageColor={imageColor} />;
  }

  return (
    <VariantInline
      width={width}
      imageColor={imageColor}
      textColor={textColor}
    />
  );
}
