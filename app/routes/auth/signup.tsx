import { useState } from "react";
import { Form, useNavigate } from "react-router";
import { authClient, signInWithDiscord } from "~/lib/auth/auth-client";
import { AuthContainer } from "./components/container";
import { InputWithLabel } from "~/components/forms/inputs";

export default function SignUpPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");

	const navigate = useNavigate();

	const signup = async () => {
		await authClient.signUp.email(
			{
				email,
				password,
				name,
			},
			{
				onRequest: (ctx) => {
					// show loading state
				},
				onSuccess: (ctx) => {
					navigate("/");
				},
				onError: (ctx) => {
					alert(JSON.stringify(ctx.error));
				},
			},
		);
	};

	return (
		<AuthContainer>
			<Form onSubmit={signup} className="border p-4 rounded-md flex flex-col gap-2">
				<InputWithLabel
					label="Email"
					id="email"
					type="text"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="border p-1"
				/>
				<InputWithLabel
					label="Password"
					id="password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="border p-1"
				/>
				<InputWithLabel
					label="Name"
					id="name"
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="border p-1"
				/>
				<button type="submit">Sign Up</button>
				<button type="button" className="bg-purple-400" onClick={signInWithDiscord}>
					Sign Up With Discord
				</button>
			</Form>
		</AuthContainer>
	);
}
