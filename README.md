## micro-frontend-sample

This repository is a small micro-frontend sample that demonstrates a multi-package setup where several frontend applications (micro-frontends) are developed independently and composed together by a container app.

The workspace contains the following example packages:

- `packages/container` — the host application that composes micro-frontends (likely via Module Federation).
- `packages/marketing` — a standalone marketing micro-frontend (contains Landing, Pricing components).
- `packages/dashboard` — a dashboard micro-frontend.
- `packages/auth` — an auth micro-frontend (authentication / login flows).

Each package contains its own `package.json` and build/dev configuration. The frontend apps use webpack configs under their `config/` folders.

## Repository layout

Top-level files and folders of note:

```
README.md
packages/
	auth/
		package.json
	container/
		package.json
		config/
			webpack.common.js
			webpack.dev.js
			webpack.prod.js
		public/
			index.html
		src/
			App.js
			bootstrap.js
			index.js
			components/
				Marketing.js
	dashboard/
		package.json
	marketing/
		package.json
		config/
			webpack.common.js
			webpack.dev.js
			webpack.prod.js
		public/
			index.html
		src/
			App.js
			bootstrap.js
			index.js
			components/
				Landing.js
				Pricing.js
```

## Goals and intent

- Show how multiple independently-deployable frontends can be composed.
- Provide a simple starting point for experimenting with webpack Module Federation and micro-frontends.
- Keep packages small and focused so each can be started, built, and tested independently.

## Prerequisites

- Node.js (LTS recommended, e.g. >= 16)
- npm or yarn
- A POSIX-like shell is used in examples (`bash.exe` on Windows).

If you use a global tool like `lerna` or a workspace manager, adjust instructions accordingly.

## Quick start

General approach: install dependencies (per-package or at root if this repository is configured as a monorepo workspace), then start the apps you want to develop.

Example commands (run from repository root or each package folder):

```bash
# install for a single package
cd packages/marketing
npm install
npm run start

# or, install and start the container
cd packages/container
npm install
npm run start
```

Notes:
- Check each package's `package.json` for the exact script names (`start`, `build`, `test`).
- The container app typically hosts or federates the remote micro-frontends — start the container and the remotes you want to load.

## Development tips

- Start the container and then start each micro-frontend you want to develop. The container will load the remotes at runtime (or via dev server integration).
- If ports or script names differ from the examples above, open the package's `package.json` and `config/webpack.*.js` to find the configured ports and dev scripts.
- To run many dev servers concurrently, consider using a terminal multiplexer or tools like `concurrently`, or configure a single root-level script if you prefer.

## Building for production

Each package usually exposes a `build` script. Example:

```bash
cd packages/marketing
npm run build
```

Build artifacts will be placed according to the package's webpack configuration (often in a `dist/` folder or similar). When deploying, the container should be configured to pull the correct remote bundles (or point to the deployed URLs).

## Testing

Look for test scripts in each package's `package.json`. Typical patterns use Jest, React Testing Library, or similar. Run:

```bash
cd packages/marketing
npm test
```
