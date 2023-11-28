
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const MANPATH: string;
	export const TERM_PROGRAM: string;
	export const TERM: string;
	export const SHELL: string;
	export const HOMEBREW_REPOSITORY: string;
	export const TMPDIR: string;
	export const CONDA_SHLVL: string;
	export const CONDA_PROMPT_MODIFIER: string;
	export const TERM_PROGRAM_VERSION: string;
	export const PNPM_HOME: string;
	export const ZSH: string;
	export const USER: string;
	export const COMMAND_MODE: string;
	export const CONDA_EXE: string;
	export const GH_NPM_TOKEN: string;
	export const SSH_AUTH_SOCK: string;
	export const __CF_USER_TEXT_ENCODING: string;
	export const WARP_IS_LOCAL_SHELL_SESSION: string;
	export const PAGER: string;
	export const WARP_USE_SSH_WRAPPER: string;
	export const _CE_CONDA: string;
	export const LSCOLORS: string;
	export const PATH: string;
	export const LaunchInstanceID: string;
	export const CONDA_PREFIX: string;
	export const __CFBundleIdentifier: string;
	export const PWD: string;
	export const P9K_SSH: string;
	export const NODE_PATH: string;
	export const XPC_FLAGS: string;
	export const _CE_M: string;
	export const XPC_SERVICE_NAME: string;
	export const SHLVL: string;
	export const HOME: string;
	export const HOMEBREW_PREFIX: string;
	export const CONDA_PYTHON_EXE: string;
	export const LESS: string;
	export const LOGNAME: string;
	export const LC_CTYPE: string;
	export const SSH_SOCKET_DIR: string;
	export const GITHUB_TOKEN: string;
	export const CONDA_DEFAULT_ENV: string;
	export const INFOPATH: string;
	export const HOMEBREW_CELLAR: string;
	export const CONDA_CHANGEPS1: string;
	export const SECURITYSESSIONID: string;
	export const COLORTERM: string;
	export const NX_CLI_SET: string;
	export const NX_LOAD_DOT_ENV_FILES: string;
	export const NX_INVOKED_BY_RUNNER: string;
	export const NX_WORKSPACE_ROOT: string;
	export const NX_TERMINAL_OUTPUT_PATH: string;
	export const NX_STREAM_OUTPUT: string;
	export const NX_TASK_TARGET_PROJECT: string;
	export const NX_TASK_TARGET_TARGET: string;
	export const NX_TASK_TARGET_CONFIGURATION: string;
	export const NX_TASK_HASH: string;
	export const LERNA_PACKAGE_NAME: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://kit.svelte.dev/docs/modules#$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/master/packages/adapter-node) (or running [`vite preview`](https://kit.svelte.dev/docs/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		MANPATH: string;
		TERM_PROGRAM: string;
		TERM: string;
		SHELL: string;
		HOMEBREW_REPOSITORY: string;
		TMPDIR: string;
		CONDA_SHLVL: string;
		CONDA_PROMPT_MODIFIER: string;
		TERM_PROGRAM_VERSION: string;
		PNPM_HOME: string;
		ZSH: string;
		USER: string;
		COMMAND_MODE: string;
		CONDA_EXE: string;
		GH_NPM_TOKEN: string;
		SSH_AUTH_SOCK: string;
		__CF_USER_TEXT_ENCODING: string;
		WARP_IS_LOCAL_SHELL_SESSION: string;
		PAGER: string;
		WARP_USE_SSH_WRAPPER: string;
		_CE_CONDA: string;
		LSCOLORS: string;
		PATH: string;
		LaunchInstanceID: string;
		CONDA_PREFIX: string;
		__CFBundleIdentifier: string;
		PWD: string;
		P9K_SSH: string;
		NODE_PATH: string;
		XPC_FLAGS: string;
		_CE_M: string;
		XPC_SERVICE_NAME: string;
		SHLVL: string;
		HOME: string;
		HOMEBREW_PREFIX: string;
		CONDA_PYTHON_EXE: string;
		LESS: string;
		LOGNAME: string;
		LC_CTYPE: string;
		SSH_SOCKET_DIR: string;
		GITHUB_TOKEN: string;
		CONDA_DEFAULT_ENV: string;
		INFOPATH: string;
		HOMEBREW_CELLAR: string;
		CONDA_CHANGEPS1: string;
		SECURITYSESSIONID: string;
		COLORTERM: string;
		NX_CLI_SET: string;
		NX_LOAD_DOT_ENV_FILES: string;
		NX_INVOKED_BY_RUNNER: string;
		NX_WORKSPACE_ROOT: string;
		NX_TERMINAL_OUTPUT_PATH: string;
		NX_STREAM_OUTPUT: string;
		NX_TASK_TARGET_PROJECT: string;
		NX_TASK_TARGET_TARGET: string;
		NX_TASK_TARGET_CONFIGURATION: string;
		NX_TASK_HASH: string;
		LERNA_PACKAGE_NAME: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
