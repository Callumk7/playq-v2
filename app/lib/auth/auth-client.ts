import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: "http:localhost:5173"
});

export function useSession() {
	const { data: session } = authClient.useSession();
	return session;
}

