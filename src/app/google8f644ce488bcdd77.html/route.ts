const BODY = "google-site-verification: google8f644ce488bcdd77.html\n";

export function GET() {
  return new Response(BODY, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
