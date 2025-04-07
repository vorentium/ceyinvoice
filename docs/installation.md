# CeyInvoice Installation Guide

This document provides detailed instructions for setting up the CeyInvoice application for development or production use.

## Development Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher) or yarn (v1.22 or higher)
- Git

### Clone the Repository

```bash
git clone https://github.com/CeyInvoice/ceyinvoice.git
cd ceyinvoice
```

### Install Dependencies

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

### Start Development Server

Using npm:
```bash
npm run dev
```

Using yarn:
```bash
yarn dev
```

This will start the development server, typically at [http://localhost:5173](http://localhost:5173).

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run linting

## Production Deployment

### Build for Production

```bash
npm run build
```

or

```bash
yarn build
```

This will create a `dist` directory with the production-ready application.

### Serving the Application

You can serve the built application using a static file server:

```bash
npm install -g serve
serve -s dist
```

### Deployment Options

#### Netlify

1. Connect your GitHub repository to Netlify
2. Set the build command to `npm run build`
3. Set the publish directory to `dist`

#### Vercel

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the Vite configuration
3. Deploy with default settings

#### GitHub Pages

1. Update the `vite.config.js` file:
   ```javascript
   export default {
     base: '/ceyinvoice/',
     // other configuration...
   }
   ```

2. Create a deployment script:
   ```bash
   #!/usr/bin/env sh
   
   # abort on errors
   set -e
   
   # build
   npm run build
   
   # navigate into the build output directory
   cd dist
   
   # if you are deploying to a custom domain
   # echo 'www.example.com' > CNAME
   
   git init
   git add -A
   git commit -m 'deploy'
   
   # if you are deploying to https://<USERNAME>.github.io/<REPO>
   git push -f git@github.com:CeyInvoice/ceyinvoice.git main:gh-pages
   
   cd -
   ```

3. Make the script executable and run it:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

## Environment Variables

CeyInvoice doesn't require environment variables for basic functionality, but you can create a `.env` file in the root directory for any custom configurations:

```
VITE_API_URL=your_api_url_if_needed
VITE_GOOGLE_ANALYTICS_ID=your_analytics_id_if_needed
```

## Troubleshooting

### Common Issues

1. **Node version issues**: Ensure you're using Node.js v14 or higher
   ```bash
   node -v
   ```

2. **Port conflicts**: If port 5173 is already in use, Vite will try to use the next available port

3. **Build errors**: Check for any linting or TypeScript errors in your code

### Getting Help

If you encounter issues not covered here, please:

1. Check the existing issues on GitHub
2. Open a new issue with detailed information about your problem
3. Contact the maintainers through GitHub 