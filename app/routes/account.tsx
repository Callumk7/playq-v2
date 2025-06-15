import { MainLayout } from "~/components/layout/main";
import type { Route } from "./+types/account";
import { getAndValidateSession } from "~/lib/auth/helpers";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Form } from "react-router";
import { InputWithLabel } from "~/components/forms/inputs";
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth/auth-client";
import { withActionLogging, withLoaderLogging } from "~/lib/route-logger.server";
import { parseForm } from "zodix";
import { db } from "~/db/index.server";
import { user, type User } from "~/db/schema/auth";
import { eq } from "drizzle-orm";
import { auth } from "~/lib/auth/auth-server";
import { z } from "zod";

const accountLoader = async ({ request }: Route.LoaderArgs) => {
	const { user } = await getAndValidateSession(request);
	return user;
};

export const loader = withLoaderLogging("account", accountLoader);

const updateSteamAction = async ({ request }: Route.ActionArgs) => {
	const { steamId } = await parseForm(request, { steamId: z.string() });

	const session = await auth.api.getSession({
		headers: request.headers,
	});

	try {
		await db.update(user).set({ steamId }).where(eq(user.id, session!.user.id));
		return { success: true };
	} catch (error) {
		console.error(error);
	}
};

export const action = withActionLogging("account", updateSteamAction);

export default function AccountPage({ loaderData }: Route.ComponentProps) {
	const user = loaderData;
	return (
		<MainLayout>
			<ProfileForm user={user} />
		</MainLayout>
	);
}

function ProfileForm({ user }: { user: User }) {
	const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const name = formData.get("name") ? formData.get("name")?.toString() : undefined;
		const email = formData.get("email") ? formData.get("email")?.toString() : undefined;

		if (name) {
			await authClient.updateUser({ name });
		}
		if (email) {
			await authClient.changeEmail({ newEmail: email });
		}
	};
	return (
		<MainLayout>
			<Card className="w-fit">
				<CardHeader>
					<CardTitle>Update Profile</CardTitle>
				</CardHeader>
				<CardContent>
					<Form method="POST" onSubmit={handleUpdateUser}>
						<div className="p-4 space-y-2">
							<InputWithLabel
								label="Name"
								id="name"
								name="name"
								placeholder={user.name}
								type="text"
							/>
							<InputWithLabel
								label="Email"
								id="email"
								name="email"
								placeholder={user.email}
								type="email"
							/>
							<InputWithLabel
								label="Password"
								id="password"
								name="password"
								type="password"
							/>
							<Button type="submit">Update</Button>
						</div>
					</Form>
				</CardContent>
			</Card>
			<Card className="w-fit">
				<CardHeader>
					<CardTitle>Link Steam ID</CardTitle>
				</CardHeader>
				<CardContent>
					<Form method="POST">
						<div className="space-y-2 p-4">
							<InputWithLabel
								label="steam ID"
								id="steamId"
								name="steamId"
								type="text"
								placeholder={user.steamId ?? undefined}
							/>
							<Button type="submit">Sync</Button>
						</div>
					</Form>
				</CardContent>
			</Card>
		</MainLayout>
	);
}
