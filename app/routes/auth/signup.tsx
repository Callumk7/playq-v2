import { useState } from "react";
import { Form, useNavigate } from "react-router";
import { authClient } from "~/lib/auth/auth-client";
import { AuthContainer } from "./components/container";

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
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-1"
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-1"
        />
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-1"
        />
        <button type="submit">Sign Up</button>
      </Form>
    </AuthContainer>
	);
}
