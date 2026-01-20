type Env = {
  GITHUB_CLIENT_ID?: string;
  GITHUB_SCOPES?: string;
};

function buildSetCookie(
  name: string,
  value: string,
  options: {
    maxAgeSeconds?: number;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "Lax" | "Strict" | "None";
    path?: string;
  } = {}
) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  parts.push(`Path=${options.path || "/"}`);
  if (typeof options.maxAgeSeconds === "number") {
    parts.push(`Max-Age=${Math.max(0, Math.floor(options.maxAgeSeconds))}`);
  }
  if (options.httpOnly !== false) parts.push("HttpOnly");
  if (options.secure) parts.push("Secure");
  parts.push(`SameSite=${options.sameSite || "Lax"}`);
  return parts.join("; ");
}

export async function onRequestGet({ request, env }: { request: Request; env: Env }) {
  const clientId = env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response("Missing GITHUB_CLIENT_ID environment variable.", { status: 500 });
  }

  const requestUrl = new URL(request.url);
  const provider = requestUrl.searchParams.get("provider");
  if (provider && provider !== "github") {
    return new Response("Unsupported provider. Use provider=github.", { status: 400 });
  }

  const state = (typeof crypto.randomUUID === "function") ? crypto.randomUUID() : String(Date.now());
  const scopes = (env.GITHUB_SCOPES && env.GITHUB_SCOPES.trim()) ? env.GITHUB_SCOPES.trim() : "repo";

  const callbackUrl = `${requestUrl.origin}/callback`;
  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", callbackUrl);
  authorizeUrl.searchParams.set("scope", scopes);
  authorizeUrl.searchParams.set("state", state);

  const headers = new Headers();
  headers.set("Location", authorizeUrl.toString());

  const isSecure = requestUrl.protocol === "https:";
  headers.append(
    "Set-Cookie",
    buildSetCookie("cms_oauth_state", state, { maxAgeSeconds: 10 * 60, secure: isSecure })
  );
  headers.set("Cache-Control", "no-store");

  return new Response(null, { status: 302, headers });
}
