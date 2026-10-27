import IconButton, {
  type IconButtonProps,
} from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

type AppCloseButtonProps = IconButtonProps;

export default function AppCloseButton({
  onClick,
  ...props
}: AppCloseButtonProps) {
  return (
    <IconButton
      aria-label="close"
      onClick={onClick}
      sx={(theme) => ({
        position: "absolute",
        right: 8,
        top: 8,
        color: theme.palette.grey[500],
      })}
      {...props}
    >
      <CloseIcon />
    </IconButton>
  );
}