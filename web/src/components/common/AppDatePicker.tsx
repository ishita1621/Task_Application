
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { Dayjs } from "dayjs";

type AppDatePickerProps = {
  label: string;
  value: Dayjs | null;
  onChange: (date: Dayjs | null) => void;
  onBlur?: () => void;
  error?: boolean;
  helperText?: string;
};

export default function AppDatePicker({
  label,
  value,
  onChange,
  onBlur,
  error = false,
  helperText = "",
}: AppDatePickerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value}
        onChange={onChange}
        slotProps={{
          textField: {
            fullWidth: true,
            size: "small",
            onBlur,
            error,
            helperText,
          },
        }}
      />
    </LocalizationProvider>
  );
}
