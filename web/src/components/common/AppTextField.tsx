import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

type AppTextFieldProps = TextFieldProps;

export default function AppTextField({
  label,
  value,
  onChange,
  sx,
  type,
  ...props
}: AppTextFieldProps) {

  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === "password";

  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      type={
        isPasswordField
          ? showPassword
            ? "text"
            : "password"
          : type
      }
      sx={{ mb: 2, ...sx }}
      fullWidth
      size="small"
      {...props}
      slotProps={{
        input: {
          endAdornment: isPasswordField ? (
            <InputAdornment position="end">
              <IconButton
                onMouseDown={(event) => event.preventDefault()}
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                edge="end"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <VisibilityOff />
                ) : (
                  <Visibility />
                )}
              </IconButton>
            </InputAdornment>
          ) : undefined,
        },
      }}
    />
  );
}
