import type * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

const tagVariants = cva(
	"inline rounded-lg h-fit data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
	{
		variants: {
			variant: {
				default: "bg-background border text-accent-foreground",
				primary: "bg-primary text-primary-foreground",
				secondary: "bg-foreground text-background",
			},
			size: {
				default: "text-[10px] px-2 py-1",
				lg: "text-sm px-3 py-2",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

interface TagProps extends VariantProps<typeof tagVariants> {
	children?: React.ReactNode;
	className?: string;
}

export function Tag({ children, className, variant, size }: TagProps) {
	return <div className={cn(tagVariants({ variant, size, className }))}>{children}</div>;
}

export function TagArray({ tags }: { tags: string[] }) {
	return (
		<div className="flex flex-wrap gap-2 self-start">
			{tags.map((tag) => (
				<Tag variant={"default"} key={tag}>
					{tag}
				</Tag>
			))}
		</div>
	);
}

export function TagToggle({
	className,
	variant,
	size,
	...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof tagVariants>) {
	return (
		<TogglePrimitive.Root
			className={cn(tagVariants({ variant, size, className }))}
			{...props}
		/>
	);
}
TagToggle.displayName = TogglePrimitive.Root.displayName;
