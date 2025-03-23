import { Outlet } from "react-router";

// TODO: Currently surplus to requirements, maybe remove
export default function ExploreLayout() {
	return (
		<div className="space-y-2">
			<Outlet />
		</div>
	);
}
