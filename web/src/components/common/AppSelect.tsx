import Select, { type SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";

type SelectOption = {
  label: string;
  value: string;
};

type AppSelectProps = {
  label: string;
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  options: readonly SelectOption[];
  error?: boolean;
  helperText?: string;
};

export default function AppSelect({
  label,
  value,
  onChange,
  options,
  error = false,
  helperText = "",
}: AppSelectProps) {
  const labelId = `${label.toLowerCase().replace(/\s+/g, "-")}-label`;

  return (
    <FormControl
      fullWidth
      margin="none"
      size="small"
      error={error}
      sx={{
        mb:2,
      }}
    >
      <InputLabel id={labelId}>{label}</InputLabel>

      <Select
        labelId={labelId}
        value={value}
        label={label}
        onChange={onChange}

      >
        {options.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>

      {helperText && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
}