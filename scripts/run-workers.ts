import dotenv from "dotenv";

// --- Environment Setup ---
// In development, we load from the .env file.
// In production (e.g., on Railway), the variables are already in process.env,
// so we do nothing.
if (process.env.NODE_ENV !== "production") {
	console.log("Running in development mode, loading .env file...");
	dotenv.config();
}

// --- Application Logic ---
// AFTER the environment is configured, we import and run the application logic.
// This ensures the workers have access to process.env when they initialize.
console.log("🔄 Starting all workers...");
console.log("Press Ctrl+C to stop");

import("../server/workers/index.js");

// Keep the process alive
// setInterval(() => {
// 	// Optional: Add health check or metrics here
// 	console.log("Worker thread tick");
// }, 30000);
