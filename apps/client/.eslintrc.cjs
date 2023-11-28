module.exports = {
	extends: [
		"../../.eslintrc.json",
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:svelte/recommended",
		"plugin:prettier/recommended",
	],
	parser: "@typescript-eslint/parser",
	ignorePatterns: [
		"!**/*",
		".eslintrc.cjs",
		"/.svelte-kit/types/src/routes/$types.d.ts",
		"/.svelte-kit/ambient.d.ts",
	],
	plugins: ["@typescript-eslint", "prettier"],
	parserOptions: {
		project: "./tsconfig.json",
		tsconfigRootDir: __dirname,
		extraFileExtensions: [".svelte"],
		sourceType: "module",
	},
	env: {
		browser: true,
		es2017: true,
		node: true,
	},
	overrides: [
		{
			files: ["*.svelte"],
			parser: "svelte-eslint-parser",
			parserOptions: {
				parser: "@typescript-eslint/parser",
			},
		},
	],
};
