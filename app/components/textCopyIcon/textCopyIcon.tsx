import { useEffect, useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import IconButton from "@mui/material/IconButton";
import type { IconButtonProps } from "@mui/material/IconButton";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import { copyText } from "~/utils/copyText";

export function TextCopyIcon({
  delay = 500,
  copyValue,
  iconColor = "#FFF",
  iconProps,
  buttonProps,
}: {
  delay?: number;
  copyValue?: string;
  iconColor?: string;
  iconProps?: SvgIconProps;
  buttonProps?: IconButtonProps;
}) {
  const [textCopied, setTextCopied] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (textCopied) {
      timer = setTimeout(() => {
        setTextCopied(false);
      }, delay);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [textCopied, delay]);

  return (
    <IconButton
      aria-label="copy to clipboard"
      title="Copy to clipboard"
      sx={{
        "&:hover": {
          backgroundColor: "transparent",
        },
        color: iconColor,
      }}
      onClick={(e) => {
        e.preventDefault();
        setTextCopied(true);
        copyText(copyValue);
      }}
      {...buttonProps}
    >
      {textCopied ? (
        <CheckCircleIcon data-testid="copy-success-icon" {...iconProps} />
      ) : (
        <ContentCopyIcon data-testid="copy-icon" {...iconProps} />
      )}
    </IconButton>
  );
}
