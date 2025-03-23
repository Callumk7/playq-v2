import type { LoaderFunctionArgs } from "react-router";
import { auth } from "~/lib/auth/auth-server";

export const loader = ({ request }: LoaderFunctionArgs) => {
	return auth.handler(request);
};

export const action = ({ request }: LoaderFunctionArgs) => {
	return auth.handler(request);
};
