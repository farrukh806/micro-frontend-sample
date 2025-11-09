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

## Deployment to Cloudflare Pages

This project is configured for deployment to Cloudflare Pages using GitHub Actions. Each micro-frontend package can be deployed as a separate Cloudflare Pages project, with the container app configured to load remotes from their respective URLs.

### Prerequisites

1. **Cloudflare Account Setup**
   - Create a Cloudflare account if you don't have one
   - Create Pages projects for your packages (e.g., `marketing-mfe`, `container-mfe`)
   - Generate an API token with Pages permissions (Account → API Tokens → Create token)

2. **GitHub Repository Secrets**
   Required secrets for GitHub Actions:
   - `CF_API_TOKEN`: Your Cloudflare API token
   - `CF_ACCOUNT_ID`: Your Cloudflare account ID
   - `CF_PAGES_PROJECT_MARKETING`: Pages project name for marketing
   - `CF_PAGES_PROJECT_CONTAINER`: Pages project name for container
   - `PRODUCTION_DOMAIN`: Full URL of the marketing app deployment (e.g., `https://marketing-mfe.pages.dev`). Should NOT include paths like `/marketing/` or `/remoteEntry.js` - these are automatically appended by the build process.

### Automated Deployments

The repository includes GitHub Actions workflows that automatically deploy:
- Marketing package (`packages/marketing`)
- Container package (`packages/container`)

Workflows trigger on pushes to `main` branch when their respective package files change.

To deploy manually:

```bash
# Install Wrangler CLI (if needed)
npm install -g wrangler

# Deploy marketing package
cd packages/marketing
npm run build
wrangler pages publish dist --project-name your-marketing-project

# Deploy container package
cd ../container
npm run build
wrangler pages publish dist --project-name your-container-project
```

### Module Federation Configuration

The container app is configured to load the marketing remote from a URL specified by `PRODUCTION_DOMAIN` environment variable during build. 

**Important:** The `PRODUCTION_DOMAIN` should be set to the full base URL of your marketing app deployment:
- ✅ Correct: `https://marketing-mfe.pages.dev` or `https://micro-frontend-sample.pages.dev`
- ❌ Incorrect: `https://marketing-mfe.pages.dev/marketing` or `https://marketing-mfe.pages.dev/remoteEntry.js`

The webpack configuration will automatically append `/remoteEntry.js` to the domain. The marketing app's `remoteEntry.js` file is built at the root of the dist folder, so it will be accessible at `{PRODUCTION_DOMAIN}/remoteEntry.js`.

Example:
- Marketing app deployed at: `https://marketing-mfe.pages.dev`
- Set `PRODUCTION_DOMAIN=https://marketing-mfe.pages.dev`
- Container will load remote from: `https://marketing-mfe.pages.dev/remoteEntry.js`

To update remote URLs:
1. Set `PRODUCTION_DOMAIN` in GitHub repository secrets (or your CI/CD environment)
2. Rebuild and redeploy the container app
3. The container's webpack config will use this to construct remote URLs during build

### Monitoring Deployments

1. GitHub Actions tab shows deployment status and logs
2. Cloudflare Pages dashboard shows:
   - Build/deployment history
   - Preview deployments (for PRs)
   - Custom domain setup
   - Analytics and logs

### Troubleshooting

Common deployment issues and solutions:

1. **Build failures**
   - Check GitHub Actions logs for build errors
   - Verify `dist` or `build` directory exists after build
   - Ensure all dependencies are installed (`npm ci`)

2. **Remote loading failures**
   - Verify `PRODUCTION_DOMAIN` is set to the full base URL (e.g., `https://marketing-mfe.pages.dev`) without any paths
   - Ensure `PRODUCTION_DOMAIN` includes the protocol (`https://`)
   - Check that `remoteEntry.js` is accessible at `{PRODUCTION_DOMAIN}/remoteEntry.js`
   - Check browser console for CORS or loading errors (404 errors often indicate incorrect URL paths)
   - Verify the marketing app was deployed successfully and `remoteEntry.js` exists in the dist folder

3. **Pages project issues**
   - Confirm project names match repository secrets
   - Check Cloudflare Pages build logs
   - Verify API token has correct permissions
