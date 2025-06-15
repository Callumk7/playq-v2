import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["scripts/run-workers.ts"], // Your worker entry point
	outDir: "build/scripts", // Where to put the output
	format: ["esm"], // Output ES Module format
	sourcemap: true,
	clean: true, // Clean the output directory before building
	tsconfig: "tsconfig.node.json", // Use this tsconfig for path resolution
	external: [/node_modules/],
});
