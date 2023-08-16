import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import { TextInput } from "~/components/input";
import {
  PasswordStrengthMeter,
  getPasswordStrength,
} from "~/components/passwordStrengthMeter/PasswordStrengthMeter";
import Box from "@mui/material/Box";

export function PasswordInput({
  label,
  name,
  error,
  autoComplete,
  required,
  onChange,
  showStrength,
}: {
  label: string;
  name: string;
  error?: string | null;
  autoComplete?: string;
  required?: boolean;
  showStrength?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);

  return (
    <Box>
      <TextInput
        fullWidth
        label={label}
        name={name}
        error={error}
        autoComplete={autoComplete}
        required={required}
        onChange={(value) => {
          showStrength &&
            setPasswordStrength(getPasswordStrength(value.target.value));
        }}
        type={showPassword ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword((show) => !show)}
                onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => {
                  event.preventDefault();
                }}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {showStrength && (
        <Box padding="0.25rem 0.75rem">
          <PasswordStrengthMeter strength={passwordStrength} />
        </Box>
      )}
    </Box>
  );
}
