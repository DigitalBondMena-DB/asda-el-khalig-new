import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine({
    allowedHosts: [
      'asda-alkhaleej.com',
      'www.asda-alkhaleej.com',
    ],
  });

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  server.get('*.*', express.static(browserDistFolder, { maxAge: '1y', immutable: true }));

  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

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

function run(): void {
  const port = Number(process.env['PORT']) || 5400;
  const server = app();

  server.listen(port, '0.0.0.0', () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
// import { AngularAppEngine, createRequestHandler } from '@angular/ssr'
// import { getAllowedHosts, getContext, getTrustProxyHeaders } from '@netlify/angular-runtime/app-engine.js'

// const angularAppEngine = new AngularAppEngine({
//   allowedHosts: getAllowedHosts(),
//   trustProxyHeaders: getTrustProxyHeaders(),
// })

// export async function netlifyAppEngineHandler(request: Request): Promise<Response> {
//   const context = getContext()

//   // Example API endpoints can be defined here.
//   // Uncomment and define endpoints as necessary.
//   // const pathname = new URL(request.url).pathname
//   // if (pathname === '/api/hello') {
//   //   return Response.json({ message: 'Hello from the API' });
//   // }

//   const result = await angularAppEngine.handle(request, context)
//   return result || new Response('Not found', { status: 404 })
// }

// /**
//  * The request handler used by the Angular CLI (dev-server and during build).
//  */
// export const reqHandler = createRequestHandler(netlifyAppEngineHandler)