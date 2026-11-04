
import { DateTime } from "luxon";

export const formatDateIST = (
    dateValue: string | Date | null | undefined
): string => {
    if (!dateValue) {
        return "-";
    }

    const date = DateTime.fromJSDate(
        dateValue instanceof Date ? dateValue : new Date(dateValue)
    ).setZone("Asia/Kolkata");

    if (!date.isValid) {
        return "-";
    }

    return date.toFormat("dd LLL yyyy");
};
