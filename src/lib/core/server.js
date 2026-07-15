'use server'

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

// Helper to get the session token on the server
export const getServerToken = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    return session?.session?.token || null;
};

// Build the Authorization header for server-side fetches
export const authHeader = async () => {
    const token = await getServerToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Base URL for API calls
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

// Handle HTTP status codes (redirect on 401/403)
const handleStatusCode = (res) => {
    if (res.status === 401) redirect('/unauthorized');
    if (res.status === 403) redirect('/forbidden');
    return res.json();
};

// Server-side mutation (POST, PATCH, DELETE)
export const serverMutation = async (path, data, method = 'POST') => {
    const res = await fetch(`${baseUrl}${path}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...await authHeader()
        },
        body: JSON.stringify(data),
    });
    return handleStatusCode(res);
};

// Server-side fetch (GET)
export const serverFetch = async (path) => {
    const res = await fetch(`${baseUrl}${path}`, {
        headers: await authHeader()
    });
    return handleStatusCode(res);
};