import Stack from "@mui/material/Stack";
import { useRef } from "react";
import CodeInputBox from "./components/codeInputBox";

const onInputChange = ({
  e,
  previousRef,
  nextRef,
}: {
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
  previousRef?: React.RefObject<HTMLInputElement>;
  nextRef?: React.RefObject<HTMLInputElement>;
}) => {
  if (e.target.value.length) {
    nextRef?.current?.focus();
  }
  if (e.target.value.length === 0) {
    previousRef?.current?.focus();
  }
};

const onInputKeydown = ({
  e,
  previousRef,
  nextRef,
}: {
  e: React.KeyboardEvent<HTMLInputElement>;
  previousRef?: React.RefObject<HTMLInputElement>;
  nextRef?: React.RefObject<HTMLInputElement>;
}) => {
  if (!e.currentTarget.value && e.code === "Backspace") {
    // if the User backspaces in an empty input, focus state to the previous input
    previousRef?.current?.focus();
  }
  if (e.currentTarget.value && e.code !== "Backspace" && e.code !== "Tab") {
    // if the User attempts to enter more than a one digit, block and focus next input
    e.preventDefault();
    nextRef?.current?.focus();
  }
};

export const CodeValidationInput = () => {
  const digit1Ref = useRef<HTMLInputElement>(null);
  const digit2Ref = useRef<HTMLInputElement>(null);
  const digit3Ref = useRef<HTMLInputElement>(null);
  const digit4Ref = useRef<HTMLInputElement>(null);
  const digit5Ref = useRef<HTMLInputElement>(null);
  const digit6Ref = useRef<HTMLInputElement>(null);
  return (
    <Stack
      paddingY={4}
      direction="row"
      width="100%"
      gap={2}
      justifyContent={"center"}
      alignItems="center"
      alignSelf="stretch"
    >
      <CodeInputBox
        ref={digit1Ref}
        onChange={(e) => onInputChange({ e, nextRef: digit2Ref })}
        onKeyDown={(e) => onInputKeydown({ e, nextRef: digit2Ref })}
        name={"digit1"}
        autoFocus
      />
      <CodeInputBox
        ref={digit2Ref}
        onChange={(e) =>
          onInputChange({ e, nextRef: digit3Ref, previousRef: digit1Ref })
        }
        onKeyDown={(e) =>
          onInputKeydown({ e, previousRef: digit1Ref, nextRef: digit3Ref })
        }
        name={"digit2"}
      />
      <CodeInputBox
        ref={digit3Ref}
        onChange={(e) =>
          onInputChange({ e, nextRef: digit4Ref, previousRef: digit2Ref })
        }
        onKeyDown={(e) =>
          onInputKeydown({ e, previousRef: digit2Ref, nextRef: digit4Ref })
        }
        name={"digit3"}
      />
      <CodeInputBox
        ref={digit4Ref}
        onChange={(e) =>
          onInputChange({ e, nextRef: digit5Ref, previousRef: digit3Ref })
        }
        onKeyDown={(e) =>
          onInputKeydown({ e, previousRef: digit3Ref, nextRef: digit5Ref })
        }
        name={"digit4"}
      />
      <CodeInputBox
        ref={digit5Ref}
        onChange={(e) =>
          onInputChange({ e, nextRef: digit6Ref, previousRef: digit4Ref })
        }
        onKeyDown={(e) =>
          onInputKeydown({ e, previousRef: digit4Ref, nextRef: digit6Ref })
        }
        name={"digit5"}
      />
      <CodeInputBox
        ref={digit6Ref}
        onChange={(e) => onInputChange({ e, previousRef: digit5Ref })}
        onKeyDown={(e) => onInputKeydown({ e, previousRef: digit5Ref })}
        name={"digit6"}
      />
    </Stack>
  );
};
