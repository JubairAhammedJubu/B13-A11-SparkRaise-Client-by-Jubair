import { proxy } from '@/lib/proxy';

export const middleware = proxy;

// `config` must be a literal object in this exact file — Next.js statically
// parses it at build time and rejects a re-export from another module.
//
// `runtime: 'nodejs'` opts this middleware out of the default Edge Runtime.
// It's required here because proxy.js calls auth.api.getSession(), which
// goes through Better Auth's MongoDB adapter (a Node.js-only API) to check
// the session — that fails under Edge with "process.getBuiltinModule is
// not supported". Needs Next.js 15.2+ (stable in 16.x).
export const config = {
    runtime: 'nodejs',
    matcher: [
        '/dashboard/:path*',
    ],
};
