interface LogContext {
	route?: string;
	method?: string;
	url?: string;
	userId?: string;
	userAgent?: string;
	ip?: string;
	timestamp?: string;
	duration?: number;
	status?: number;
	error?: string;
	[key: string]: unknown;
}

type LogLevel = "info" | "warn" | "error" | "debug";

class Logger {
	private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
		const timestamp = new Date().toISOString();
		const logData = {
			level: level.toUpperCase(),
			timestamp,
			message,
			...context,
		};
		return JSON.stringify(logData);
	}

	info(message: string, context?: LogContext) {
		console.log(this.formatMessage("info", message, context));
	}

	warn(message: string, context?: LogContext) {
		console.warn(this.formatMessage("warn", message, context));
	}

	error(message: string, context?: LogContext) {
		console.error(this.formatMessage("error", message, context));
	}

	debug(message: string, context?: LogContext) {
		console.debug(this.formatMessage("debug", message, context));
	}

	// Helper method for route-specific logging
	route(routeName: string, method: string, url: string, additionalContext?: Partial<LogContext>) {
		this.info("Route accessed", {
			route: routeName,
			method,
			url,
			...additionalContext,
		});
	}

	// Helper method for loader/action performance logging
	performance(routeName: string, type: "loader" | "action", duration: number, additionalContext?: Partial<LogContext>) {
		this.info(`${type} completed`, {
			route: routeName,
			type,
			duration,
			...additionalContext,
		});
	}
}

export const logger = new Logger();
export type { LogContext, LogLevel };
