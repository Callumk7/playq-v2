import { redirect } from "react-router";
import { auth } from "./auth-server";

export async function getAndValidateSession(request: Request) {
	const session = await auth.api.getSession({
		headers: request.headers,
	});

	if (!session) throw redirect("/auth/login");
	return session;
}
