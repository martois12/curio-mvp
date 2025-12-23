import { cn } from "@/lib/utils";

type EmptyStateVariant = "default" | "warning" | "error";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  variant?: EmptyStateVariant;
  className?: string;
}

const variantStyles: Record<EmptyStateVariant, string> = {
  default: "bg-gray-50 border-gray-200",
  warning: "bg-yellow-50 border-yellow-200",
  error: "bg-red-50 border-red-200",
};

const titleStyles: Record<EmptyStateVariant, string> = {
  default: "text-gray-800",
  warning: "text-yellow-800",
  error: "text-red-800",
};

const descriptionStyles: Record<EmptyStateVariant, string> = {
  default: "text-gray-600",
  warning: "text-yellow-600",
  error: "text-red-600",
};

export function EmptyState({
  title,
  description,
  action,
  variant = "default",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "border rounded-lg p-8 text-center",
        variantStyles[variant],
        className
      )}
    >
      <h3 className={cn("text-lg font-medium mb-2", titleStyles[variant])}>
        {title}
      </h3>
      {description && (
        <p className={cn("text-sm mb-4", descriptionStyles[variant])}>
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
