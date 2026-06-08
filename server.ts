import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import compression from 'compression';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';

// List of known bot user agents (Facebook, Twitter, LinkedIn, etc.)
const botUserAgents = [
  'facebookexternalhit',
  'Twitterbot',
  'LinkedInBot',
  'Googlebot',
  'bingbot',
  'Slackbot',
  'WhatsApp',
  'TelegramBot',
  'Discordbot',
];

// Function to sanitize input to prevent XSS
const escapeHtml = (unsafe: string) =>
  unsafe.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Express app setup
export function app(): express.Express {
  const server = express();
  server.use(compression());
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, { maxAge: '1y', immutable: true }));

  // Handle requests with SSR & dynamic meta tags
  server.get('*', async (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;
    const userAgent = headers['user-agent'] || '';
    const isBot = botUserAgents.some((bot) => userAgent.includes(bot));

    // Extract blog ID from URL (supports slugs like /blog/title-123)
    const blogIdMatch = originalUrl.match(/\/blog\/(?:[^\/-]+-)?(\d+)/);
    const blogId = blogIdMatch ? blogIdMatch[1] : null;

    if (isBot && blogId) {
      try {
        const response = await fetch(`https://your-api.com/blog/${blogId}`);
        if (!response.ok)
          throw new Error(
            `Failed to fetch blog data (status: ${response.status})`
          );

        const blogData = await response.json();

        // Inject SEO meta tags
        const metaTags = `
          <meta property="og:title" content="${escapeHtml(
          blogData.blog.post_title
        )}" />
          <meta property="og:description" content="${escapeHtml(
          blogData.blog.post_content
        )}" />
          <meta property="og:image" content="${escapeHtml(
          blogData.blog.post_image
        )}" />
          <meta property="og:url" content="${protocol}://${headers.host
          }${originalUrl}" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${escapeHtml(
            blogData.blog.post_title
          )}" />
          <meta name="twitter:description" content="${escapeHtml(
            blogData.blog.post_content
          )}" />
          <meta name="twitter:image" content="${escapeHtml(
            blogData.blog.post_image
          )}" />
        `;

        commonEngine
          .render({
            bootstrap,
            documentFilePath: indexHtml,
            url: `${protocol}://${headers.host}${originalUrl}`,
            publicPath: browserDistFolder,
            providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
          })
          .then((html) => {
            const modifiedHtml = html.replace('</head>', `${metaTags}</head>`);
            res.send(modifiedHtml);
          })
          .catch((err) => next(err));

        return;
      } catch (error) {
        console.error('Error fetching blog data:', error);
      }
    }

    // Normal SSR rendering for human users
    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

// Start the server
function run(): void {
  const port = process.env['PORT'] || 5400;
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
// import { CommonEngine } from '@angular/ssr/node'
// import { render } from '@netlify/angular-runtime/common-engine.mjs'

// const commonEngine = new CommonEngine()

// export async function netlifyCommonEngineHandler(request: Request, context: any): Promise<Response> {
//   // Example API endpoints can be defined here.
//   // Uncomment and define endpoints as necessary.
//   // const pathname = new URL(request.url).pathname;
//   // if (pathname === '/api/hello') {
//   //   return Response.json({ message: 'Hello from the API' });
//   // }

//   return await render(commonEngine)
// }