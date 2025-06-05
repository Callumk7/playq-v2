import type { ReactNode } from "react"
import { cn } from "~/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

export function MainLayout({children, className} :MainLayoutProps) {
  return (
    <div className={cn("space-y-4 p-4 h-full", className)}>
      {children}
    </div>
  )
}
