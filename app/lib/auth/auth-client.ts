import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: "http:localhost:5173"
});

export function useSession() {
	const { data: session, error, isPending } = authClient.useSession();

	if (error) {
		throw error;
	}

	return { session, isPending };
}

// Auth context



