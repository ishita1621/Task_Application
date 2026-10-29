import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import AppBox from "./AppBox";

type AppLoaderProps = {
    size?: number;
    message?: string;
};

export default function AppLoader({
    size = 24,
    message,
}: AppLoaderProps) {
    return (
        <AppBox
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
            }}
        >
            <CircularProgress size={size} />

            {message && (
                <Typography variant="body2">
                    {message}
                </Typography>
            )}
        </AppBox>
    );
}