import Box from "@mui/material/Box";

export function getPasswordStrength(password: string) {
  let strength = 0;
  if (password.match(/[a-z]/g)) strength += 1;
  if (password.match(/[A-Z]/g)) strength += 1;
  if (password.match(/[0-9]/g)) strength += 1;
  if (password.match(/[^a-zA-Z\d]/g)) strength += 1;
  if (password.length >= 12) strength += 1;
  return strength;
}

export function PasswordStrengthMeter({ strength }: { strength: number }) {
  const barColor =
    strength === 1
      ? "error.dark"
      : strength === 2
        ? "warning.dark"
        : strength === 3
          ? "warning.light"
          : strength === 4
            ? "info.main"
            : strength === 5
              ? "success.main"
              : "gray.300";

  return (
    <Box display="flex" gap={1}>
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <Box
            key={i}
            sx={{ backgroundColor: strength > i ? barColor : "grey.300" }}
            flex="1"
            height="0.5rem"
            borderRadius="2px"
          />
        ))}
    </Box>
  );
}
