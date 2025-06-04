import type { LoaderFunctionArgs } from "react-router";
import { auth } from "~/lib/auth/auth-server";
import { withLoaderLogging, withActionLogging } from "~/lib/route-logger.server";

const authLoader = ({ request }: LoaderFunctionArgs) => {
	return auth.handler(request);
};

const authAction = ({ request }: LoaderFunctionArgs) => {
	return auth.handler(request);
};

export const loader = withLoaderLogging("api/auth", authLoader);
export const action = withActionLogging("api/auth", authAction);
