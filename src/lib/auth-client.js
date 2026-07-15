import { createAuthClient } from "better-auth/react";
import { adminClient, jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [
    adminClient(),
    jwtClient()
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;

// Doc requirement: "store a secret access-token for users in their browser local storage"
// after login/registration. Better Auth already protects private routes server-side via
// its session cookie (see dashboard/layout.jsx + proxy.js), so this local storage copy is
// specifically for client components that call the Express API directly.
export const ACCESS_TOKEN_KEY = "cf_access_token";

export const syncAccessToken = async () => {
  try {
    const { data } = await authClient.getSession();
    const token = data?.session?.token;
    if (token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
    return token || null;
  } catch {
    return null;
  }
};

export const getStoredAccessToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const clearAccessToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

