import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { logger } from "./logger.server";

function extractRequestMetadata(request: Request) {
	const url = new URL(request.url);
	return {
		method: request.method,
		url: request.url,
		pathname: url.pathname,
		search: url.search,
		userAgent: request.headers.get("user-agent") || undefined,
		ip: request.headers.get("x-forwarded-for") || 
			request.headers.get("x-real-ip") || 
			undefined,
	};
}

export function withLoaderLogging<T, TArgs extends LoaderFunctionArgs>(
	routeName: string,
	loader: (args: TArgs) => Promise<T> | T
) {
	return async (args: TArgs): Promise<T> => {
		const startTime = Date.now();
		const metadata = extractRequestMetadata(args.request);
		
		logger.route(routeName, metadata.method, metadata.url, {
			type: "loader",
			pathname: metadata.pathname,
			search: metadata.search,
			userAgent: metadata.userAgent,
			ip: metadata.ip,
		});

		try {
			const result = await loader(args);
			const duration = Date.now() - startTime;
			
			logger.performance(routeName, "loader", duration, {
				status: 200,
				pathname: metadata.pathname,
			});
			
			return result;
		} catch (error) {
			const duration = Date.now() - startTime;
			const errorMessage = error instanceof Error ? error.message : "Unknown error";
			
			logger.error("Loader error", {
				route: routeName,
				type: "loader",
				duration,
				error: errorMessage,
				pathname: metadata.pathname,
			});
			
			throw error;
		}
	};
}

export function withActionLogging<T, TArgs extends ActionFunctionArgs>(
	routeName: string,
	action: (args: TArgs) => Promise<T> | T
) {
	return async (args: TArgs): Promise<T> => {
		const startTime = Date.now();
		const metadata = extractRequestMetadata(args.request);
		
		logger.route(routeName, metadata.method, metadata.url, {
			type: "action",
			pathname: metadata.pathname,
			search: metadata.search,
			userAgent: metadata.userAgent,
			ip: metadata.ip,
		});

		try {
			const result = await action(args);
			const duration = Date.now() - startTime;
			
			logger.performance(routeName, "action", duration, {
				status: 200,
				pathname: metadata.pathname,
			});
			
			return result;
		} catch (error) {
			const duration = Date.now() - startTime;
			const errorMessage = error instanceof Error ? error.message : "Unknown error";
			
			logger.error("Action error", {
				route: routeName,
				type: "action", 
				duration,
				error: errorMessage,
				pathname: metadata.pathname,
			});
			
			throw error;
		}
	};
}
