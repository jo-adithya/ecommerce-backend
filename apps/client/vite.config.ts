/// <reference types='vitest' />
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	cacheDir: "../../node_modules/.vite/client",

	plugins: [react(), nxViteTsPaths()],

	// Uncomment this if you are using workers.
	// worker: {
	//  plugins: [ nxViteTsPaths() ],
	// },

	test: {
		setupFiles: ["./test-setup.ts"],
		globals: true,
		cache: {
			dir: "../../node_modules/.vitest",
		},
		environment: "jsdom",
		include: ["./app/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
	},
});
