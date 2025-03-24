import { redirect } from "react-router";

export function validateParam(param: string | undefined, redirectTo: string): string {
	if (!param) {
		throw redirect(redirectTo);
	}
	return param;
}
