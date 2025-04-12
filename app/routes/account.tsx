import { MainLayout } from "~/components/layout/main";
import type { Route } from "./+types/account";
import { getAndValidateSession } from "~/lib/auth/helpers";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Form } from "react-router";
import { InputWithLabel } from "~/components/forms/inputs";
import type { User } from "better-auth";
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth/auth-client";

export const loader = async ({ request }: Route.LoaderArgs) => {
	const { user } = await getAndValidateSession(request);
	return user;
};

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
	);
}
