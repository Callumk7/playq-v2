import type { User } from "better-auth";
import { LoaderIcon } from "lucide-react";
import { createContext, useContext, type ReactNode } from "react";
import { Navigate } from "react-router";
import { useSession } from "~/lib/auth/auth-client";

interface AuthContextType {
	user: User; // Replace with your actual user type
	isAuthenticated: boolean;
	isPending: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props for the provider component
interface AuthProviderProps {
	children: ReactNode;
	loginPath?: string;
}

export function AuthProvider({ children, loginPath = "auth/login" }: AuthProviderProps) {
	const { session, isPending } = useSession();

	if (isPending) {
		return (
			<div className="flex justify-center items-center h-screen">
				<LoaderIcon className="animate-spin" />
			</div>
		);
	}

	// If no session exists, redirect to login
	if (!session) {
		return <Navigate to={loginPath} replace />;
	}

	// Provide the auth context to children
	const value = {
		user: session.user,
		isAuthenticated: true,
		isPending: false,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth(): AuthContextType {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
}
