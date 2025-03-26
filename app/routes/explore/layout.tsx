import { Outlet } from "react-router";
import { Breadcrumb } from "~/components/ui/breadcrumb";

// TODO: Currently surplus to requirements, maybe remove
export default function ExploreLayout() {
	return (
		<div className="space-y-2">
			<Outlet />
		</div>
	);
}

export const handle = {
  breadcrumb: "Explore"
}
