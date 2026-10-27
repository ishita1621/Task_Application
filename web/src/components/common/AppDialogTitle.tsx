import DialogTitle, {
  type DialogTitleProps,
} from "@mui/material/DialogTitle";

type AppDialogTitleProps = DialogTitleProps;

export default function AppDialogTitle({
  children,
  ...props
}: AppDialogTitleProps) {
  return (
    <DialogTitle
      sx={{ m: 0, p: 2 }}
      id="customized-dialog-title"
      {...props}
    >
      {children}
    </DialogTitle>
  );
}