import { Outlet, redirect } from "react-router";
import { authClient } from "~/lib/auth/auth-client";
import type { Route } from "./+types/layout";

export const clientLoader = async () => {
	const { data: session } = await authClient.getSession();
	if (!session) {
		return redirect("/auth/login");
	}

  return session.user.id;
};

export default function AuthLayout({loaderData}: Route.ComponentProps) {
  const userId = loaderData;
  localStorage.setItem("userId", userId);

	return <Outlet />;
}
