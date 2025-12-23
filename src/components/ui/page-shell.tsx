import { cn } from "@/lib/utils";
import Link from "next/link";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <main className={cn("min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8", className)}>
      <div className="max-w-4xl mx-auto">{children}</div>
    </main>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  backHref,
  backLabel = "Back",
  actions,
}: PageHeaderProps) {
  return (
    <header className="mb-8">
      {backHref && (
        <Link
          href={backHref}
          className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-flex items-center gap-1"
        >
          <span aria-hidden="true">&larr;</span> {backLabel}
        </Link>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h1>
          {description && (
            <p className="text-gray-600 mt-2">{description}</p>
          )}
        </div>
        {actions && <div className="flex-shrink-0">{actions}</div>}
      </div>
    </header>
  );
}
