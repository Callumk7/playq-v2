import { useState } from "react";
import { Form, useNavigate } from "react-router";
import { authClient } from "~/lib/auth/auth-client";
import { AuthContainer } from "./components/container";

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

	return (
		<AuthContainer>
			{isLoading && <p>Loading...</p>}
			<Form onSubmit={signIn} className="border p-4 rounded-md flex flex-col gap-2">
				<label htmlFor="email">Email</label>
				<input
					id="email"
					type="email"
					onChange={(e) => setEmail(e.target.value)}
					className="p-1 border"
				/>
				<label htmlFor="password">Password</label>
				<input
					id="password"
					type="password"
					onChange={(e) => setPassword(e.target.value)}
					className="border p-1"
				/>
				<button type="submit">Sign In</button>
			</Form>
		</AuthContainer>
	);
}
