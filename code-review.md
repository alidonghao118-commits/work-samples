# Code review sample: preserving an explicit override across a Next.js proxy

Independent open-source review of Bitcoindefi/OpenAO, pinned to commit
12b967c163f4eca01e80f758aeedc8b153bfc249. This is a Next.js proxy-transport
method sample, rather than a RAG implementation or commissioned client case.

## Finding
File: `frontend/app/api/editor/[...path]/route.ts`
Function: `handleEditorProxy`
Baseline lines 66-74 construct outgoing headers; lines 84-92 send them upstream.
Only server-derived credentials and Content-Type are included. The caller's
x-protected-map-override header is lost.

## Trigger and impact
Send PUT /api/editor/maps/1 with x-protected-map-override: true, a session cookie,
and a configured server proxy token. The outgoing map request omits the override.
An API implementation requiring that explicit flag cannot receive the user's
intent through this proxy, even when the user otherwise has appropriate rights.
POST and DELETE have the same transport defect.

## Minimal fix
Insert the following ten lines, including the two blank lines, before baseline
line 76. They become patched lines 76-85:

    const protectedMapOverride = request.headers.get("x-protected-map-override");

    if (
        path[0] === "maps" &&
        (method === "PUT" || method === "POST" || method === "DELETE") &&
        protectedMapOverride !== null
    ) {
        headers.set("x-protected-map-override", protectedMapOverride);
    }

This allowlist preserves the value returned by Headers.get without case
normalization or Boolean parsing. The API retains interpretation and permission
decisions; incoming credentials never replace server-derived credentials.

## Evidence
The same 18 assertions execute the actual exported handlers from both source
files: baseline 13/18 passed, patched 18/18 passed. The five failures cover true
forwarding for PUT/POST/DELETE, uppercase TRUE, and other present values. Regression
checks preserve missing-session 401, missing-server-token 403, credential
isolation, GET/non-map behavior, body bytes, query parameters, and response data.

## Scope
These are handler-level, stub-backed transport tests using native Node Request
and Headers. Next dependencies, environment values, and fetch are fixtures.
They make no network calls and use no database or real accounts. Backend
authorization, database writes, and full HTTP integration remain separate
verification tasks. The patch is local; no upstream merge is claimed.
