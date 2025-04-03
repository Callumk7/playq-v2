import type { ReactNode } from "react";
import { MainLayout } from "./main";

interface CommentsLayoutProps {
	children: ReactNode;
	commentsSlot: ReactNode;
}

export function CommentsLayout({ children, commentsSlot }: CommentsLayoutProps) {
	return (
		<div className="flex h-full">
			<div className="flex-1 border-r">
        <MainLayout>{children}</MainLayout>
      </div>
			<div className="w-1/3">{commentsSlot}</div>
		</div>
	);
}
