import "../server/workers/index.js";

console.log("🔄 Starting all workers...");
console.log("Press Ctrl+C to stop");

// Keep the process alive
setInterval(() => {
	// Optional: Add health check or metrics here
	console.log("Worker thread tick");
}, 30000);
