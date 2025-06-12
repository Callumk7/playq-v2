import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

export const { signIn, signOut, signUp, useSession, forgetPassword, resetPassword } =
	authClient;

export const signInWithDiscord = async () => {
	const data = await signIn.social({
		provider: "discord",
	});

	console.log(data.data);
};
