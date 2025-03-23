import type { ComponentProps, HTMLAttributes } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface InputWithLabelProps extends ComponentProps<"input"> {
  label: string;
}
export function InputWithLabel({label, id, ...props}: InputWithLabelProps) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props}  />
    </div>
  )
}
