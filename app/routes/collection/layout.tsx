import { Outlet } from "react-router";

export default function CollectionLayout() {
  return <Outlet />
}

export const handle = {
  breadcrumb: "Collection"
}
