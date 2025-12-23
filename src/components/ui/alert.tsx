import { cn } from "@/lib/utils";

type AlertVariant = "default" | "success" | "warning" | "error" | "info";

interface AlertProps {
  children: React.ReactNode;
  variant?: AlertVariant;
  className?: string;
}

const variantStyles: Record<AlertVariant, string> = {
  default: "bg-gray-50 border-gray-200 text-gray-800",
  success: "bg-green-50 border-green-200 text-green-800",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  error: "bg-red-50 border-red-200 text-red-600",
  info: "bg-blue-50 border-blue-200 text-blue-800",
};

export function Alert({ children, variant = "default", className }: AlertProps) {
  return (
    <div
      className={cn(
        "border rounded-md p-3 text-sm",
        variantStyles[variant],
        className
      )}
      role="alert"
    >
      {children}
    </div>
  );
}
