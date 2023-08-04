import { VariantInline } from "./VariantInline.svg";
import { VariantStacked } from "./VariantStacked.svg";
import { VariantImageOnly } from "./VariantImageOnly.svg";
import { useColorMode } from "~/styles/ThemeContext";
type Props = {
  variant?: "inline" | "stacked" | "imageOnly";
  width?: string;
  imageColor?: string;
  textColor?: string;
};

export function Logo({ textColor, imageColor, variant, width }: Props) {
  const { colorMode } = useColorMode();

  if (variant === "stacked") {
    return (
      <VariantStacked
        width={width}
        imageColor={imageColor}
        textColor={textColor || colorMode === "dark" ? "#FFFFFF" : "#212121"}
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
      textColor={textColor || colorMode === "dark" ? "#FFFFFF" : "#212121"}
    />
  );
}
