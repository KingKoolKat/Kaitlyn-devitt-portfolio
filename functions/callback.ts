type Env = {
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
};

function parseCookies(request: Request) {
  const header = request.headers.get("Cookie") || "";
  const pairs = header.split(";").map((part) => part.trim()).filter(Boolean);
  const cookies: Record<string, string> = {};
  for (const pair of pairs) {
    const index = pair.indexOf("=");
    if (index === -1) continue;
    const name = pair.slice(0, index).trim();
    const value = pair.slice(index + 1).trim();
    cookies[name] = decodeURIComponent(value);
  }
  return cookies;
}

function buildSetCookie(name: string, value: string, options: {
  maxAgeSeconds?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "Lax" | "Strict" | "None";
  path?: string;
} = {}) {
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

function htmlResponse(content: string, headers: HeadersInit = {}) {
  const responseHeaders = new Headers(headers);
  responseHeaders.set("Content-Type", "text/html; charset=utf-8");
  responseHeaders.set("Cache-Control", "no-store");
  return new Response(content, { status: 200, headers: responseHeaders });
}

function renderPostMessage({ status, token, error, origin }: {
  status: "success" | "error";
  token?: string;
  error?: string;
  origin: string;
}) {
  const payload = status === "success"
    ? { token, provider: "github" }
    : { error: error || "Authentication failed", provider: "github" };
  const messagePrefix = status === "success" ? "authorization:github:success:" : "authorization:github:error:";
  const payloadJson = JSON.stringify(payload);
  const targetOrigin = JSON.stringify(origin);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Signing in…</title>
  </head>
  <body>
    <script>
      (function () {
        var payload = ${payloadJson};
        var message = ${JSON.stringify(messagePrefix)} + JSON.stringify(payload);
        try {
          if (window.opener && typeof window.opener.postMessage === "function") {
            window.opener.postMessage(message, ${targetOrigin});
          }
        } finally {
          window.close();
        }
      })();
    </script>
    <p>Authentication complete. You can close this window.</p>
  </body>
</html>`;
}

export async function onRequestGet({ request, env }: { request: Request; env: Env }) {
  const requestUrl = new URL(request.url);
  const cookies = parseCookies(request);
  const origin = requestUrl.origin;

  const isSecure = requestUrl.protocol === "https:";
  const clearCookies = new Headers();
  clearCookies.append("Set-Cookie", buildSetCookie("cms_oauth_state", "", { maxAgeSeconds: 0, secure: isSecure }));

  const oauthError = requestUrl.searchParams.get("error");
  if (oauthError) {
    return htmlResponse(
      renderPostMessage({ status: "error", error: oauthError, origin }),
      clearCookies
    );
  }

  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");
  if (!code || !state) {
    return htmlResponse(
      renderPostMessage({ status: "error", error: "Missing code/state", origin }),
      clearCookies
    );
  }

  const expectedState = cookies.cms_oauth_state;
  if (!expectedState || expectedState !== state) {
    return htmlResponse(
      renderPostMessage({ status: "error", error: "Invalid state", origin }),
      clearCookies
    );
  }

  const clientId = env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return htmlResponse(
      renderPostMessage({ status: "error", error: "Missing GitHub OAuth env vars", origin }),
      clearCookies
    );
  }

  const tokenParams = new URLSearchParams();
  tokenParams.set("client_id", clientId);
  tokenParams.set("client_secret", clientSecret);
  tokenParams.set("code", code);
  tokenParams.set("redirect_uri", `${requestUrl.origin}/callback`);

  let tokenJson: any;
  try {
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      },
      body: tokenParams.toString()
    });
    tokenJson = await tokenResponse.json();
  } catch (error) {
    return htmlResponse(
      renderPostMessage({ status: "error", error: "Token exchange failed", origin }),
      clearCookies
    );
  }

  const accessToken = tokenJson && tokenJson.access_token;
  if (!accessToken) {
    const description = tokenJson && (tokenJson.error_description || tokenJson.error) || "No access token returned";
    return htmlResponse(
      renderPostMessage({ status: "error", error: description, origin }),
      clearCookies
    );
  }

  return htmlResponse(
    renderPostMessage({ status: "success", token: accessToken, origin }),
    clearCookies
  );
}
