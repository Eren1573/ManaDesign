// Convex HTTP Router
// Mounts authentication and webhook handlers

export function handleHttpRequest(request: Request) {
  const url = new URL(request.url);

  if (url.pathname.startsWith('/api/auth')) {
    return new Response(JSON.stringify({ status: 'ok', service: 'convex-auth' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response('Not Found', { status: 404 });
}
