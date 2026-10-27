import type { ReactNode } from "react";
import AppButton from "./AppButton";

type TaskPageContentProps = {
    onAddTask: () => void;
    onFilter: () => void;
    onUserDetails: () => void;
    children: ReactNode;
};

export default function TaskPageContent({
    onAddTask,
    onFilter,
    onUserDetails,
    children,
}: TaskPageContentProps) {
    return (
        <>
            <AppButton
                onClick={onAddTask}
            >
                Add Task
            </AppButton>

            <AppButton
                onClick={onFilter}
            >
                Filter
            </AppButton>

            <AppButton
                onClick={onUserDetails}
            >
               User Details
            </AppButton>


            {children}
        </>
    );
}