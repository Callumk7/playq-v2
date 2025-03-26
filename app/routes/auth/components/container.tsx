import type { ReactNode } from "react"

interface AuthContainerProps {
  children: ReactNode
}

export function AuthContainer({children} :AuthContainerProps) {
  return (
   <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {children}
      </div>
    </div>
  )
}
