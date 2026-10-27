import TextField, { type TextFieldProps } from "@mui/material/TextField";

type AppTextFieldProps = TextFieldProps;

export default function AppTextField({
  label,
  value,
  onChange,
  ...props
}: AppTextFieldProps) {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      fullWidth
      size="small"
      {...props}
    />
  );
}
