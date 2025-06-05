import { useState } from "react";
import { Form, useNavigate } from "react-router";
import { authClient } from "~/lib/auth/auth-client";
import { AuthContainer } from "./components/container";
import { InputWithLabel } from "~/components/forms/inputs";
import { Button } from "~/components/ui/button";
import { RefreshCwIcon } from "lucide-react";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();

	const signIn = async () => {
		await authClient.signIn.email(
			{
				email,
				password,
			},
			{
				onRequest: (ctx) => {
					setIsLoading(true);
				},
				onSuccess: (ctx) => {
					navigate("/");
				},
				onError: (ctx) => {
					setIsLoading(false);
					alert(JSON.stringify(ctx.error));
				},
			},
		);
	};

	// TODO: client side validation and error handling.

	return (
		<AuthContainer>
			<Form onSubmit={signIn} className="border p-4 rounded-md flex flex-col gap-2">
				<InputWithLabel
					label="Email"
					id="email"
					type="email"
					onChange={(e) => setEmail(e.target.value)}
					className="p-1 border"
				/>
				<InputWithLabel
					label="Password"
					id="password"
					type="password"
					onChange={(e) => setPassword(e.target.value)}
					className="border p-1"
				/>
				<Button type="submit" disabled={isLoading}>
					{isLoading ? <RefreshCwIcon className="animate-spin" /> : "Sign in"}
				</Button>
			</Form>
		</AuthContainer>
	);
}
