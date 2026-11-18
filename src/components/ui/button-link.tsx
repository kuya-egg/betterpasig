import type { ComponentProps } from "react"
import { Button } from "./button"

type Props = ComponentProps<"a"> & { variant?: "default" | "outline" }

export function ButtonLink({ variant = "default", className, ...props }: Props) {
  return (
    <Button asChild variant={variant} size="lg" className={className}>
      <a {...props} />
    </Button>
  )
}
