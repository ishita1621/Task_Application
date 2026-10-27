import Button, { type ButtonProps } from "@mui/material/Button";
import type { ReactNode } from "react";

type AppButtonProps = Omit<ButtonProps, "children"> & {
  children: ReactNode;
};

export default function AppButton({
  children,
  variant = "contained",
  color = "primary",
  sx,
  ...props
}: AppButtonProps) {
  return (
    <Button
      variant={variant}
      color={color}
      sx={{...sx }}
      {...props}
    >
      {children}
    </Button>
  );
}
