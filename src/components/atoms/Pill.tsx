interface PillProps {
    status: string,
}

export default function Pill({ status }: PillProps) {

    const variantStyles: Record<string, string> = {
        completed:
        "bg-success-fill text-success-text",
        approved:
        "bg-warning-fill text-warning-text",
        pending:
        "bg-negative-fill text-negative-text",
        rejected:
        "bg-danger-fill text-danger-text",
    };

    const dotStyles: Record<string, string> = {
        completed:
        "bg-success-indicator",
        approved:
        "bg-warning-indicator",
        pending:
        "bg-negative-indicator",
        rejected:
        "bg-danger-indicator",
    }

    return (
        <div className={`inline-flex w-fit items-center gap-1.5 px-2 py-1 rounded-full sm:gap-2 sm:px-3 ${variantStyles[status]}`}>
            <span className={`w-2 h-2 rounded-full shrink-0 ${dotStyles[status]}`} />
            <p className="font-medium capitalize leading-5 whitespace-nowrap">{status}</p>
        </div>
    )

}
