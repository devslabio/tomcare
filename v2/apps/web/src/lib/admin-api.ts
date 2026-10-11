"use client";

import { useCallback, useEffect, useState } from "react";

/** Same-origin: nginx (production) or the Next.js rewrite (local) forwards /v1 to the API. */
export const API_BASE = "/v1";

const TOKEN_KEY = "tomcare_access_token";
const SESSION_KEY = "tomcare_session";

export type StaffRole = "ADMIN" | "EDITOR";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
};

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setSession(token: string, user: SessionUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function updateSessionUser(user: SessionUser) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function getSessionUser(): SessionUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
}

export function canAccess(user: SessionUser | null | undefined, roles?: readonly StaffRole[]) {
  if (!user) return false;
  if (!roles?.length || user.role === "ADMIN") return true;
  return roles.includes(user.role);
}

function redirectToLogin() {
  clearSession();
  const next = `${window.location.pathname}${window.location.search}`;
  // A full page load discards all client state belonging to the expired session.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.assign(`/admin/login?next=${encodeURIComponent(next)}`);
}

async function request(path: string, init?: RequestInit & { json?: unknown }) {
  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");
  if (init?.json !== undefined) headers.set("Content-Type", "application/json");
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    body: init?.json !== undefined ? JSON.stringify(init.json) : init?.body,
  });

  if (res.status === 401 && token && !path.startsWith("/auth/login")) {
    redirectToLogin();
    throw new ApiError("Your session has expired. Please sign in again.", 401);
  }

  if (!res.ok) {
    let message = res.statusText;
    try {
      const err = (await res.json()) as { message?: string | string[] };
      if (Array.isArray(err.message)) message = err.message.join(", ");
      else if (err.message) message = err.message;
    } catch {
      /* ignore */
    }
    throw new ApiError(message || `Request failed (${res.status})`, res.status);
  }
  return res;
}

export async function api<T>(path: string, init?: RequestInit & { json?: unknown }): Promise<T> {
  const res = await request(path, init);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

const MAX_UPLOAD_WIDTH = 2560;

/** Uploads are served as-is (the server cannot run an image optimizer), so oversized photos are downscaled to WebP here. */
async function shrinkImage(file: File): Promise<File> {
  if (file.size < 600_000 && file.type !== "image/jpeg") return file;
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  const scale = Math.min(1, MAX_UPLOAD_WIDTH / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.86));
  if (!blob || blob.type !== "image/webp" || blob.size >= file.size) return file;
  return new File([blob], file.name.replace(/\.\w+$/, "") + ".webp", { type: "image/webp" });
}

export async function uploadImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", await shrinkImage(file));
  const { url } = await api<{ url: string }>("/uploads/image", { method: "POST", body });
  return url;
}

export type Paged<T> = { items: T[]; total: number; page: number; pageSize: number };

/** Loads `path` (skipped while null) and exposes `reload` plus `setData` for optimistic updates. */
export function useResource<T>(path: string | null) {
  const [state, setState] = useState<{ path?: string | null; data?: T; error?: string }>({});
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!path) return;
    let active = true;
    api<T>(path).then(
      (data) => active && setState({ path, data }),
      (error: Error) => active && setState((prev) => ({ path, data: prev.path === path ? prev.data : undefined, error: error.message })),
    );
    return () => {
      active = false;
    };
  }, [path, version]);

  const reload = useCallback(() => setVersion((value) => value + 1), []);
  const setData = useCallback(
    (update: (data: T) => T) => setState((prev) => (prev.data === undefined ? prev : { ...prev, data: update(prev.data) })),
    [],
  );

  const current = state.path === path;
  return {
    data: current ? state.data : undefined,
    error: current ? state.error : undefined,
    loading: Boolean(path) && !current,
    reload,
    setData,
  };
}

export function blankToUndefined<T extends Record<string, unknown>>(values: T, keys: (keyof T)[]): T {
  const copy = { ...values };
  for (const key of keys) {
    if (typeof copy[key] === "string" && !(copy[key] as string).trim()) copy[key] = undefined as T[keyof T];
  }
  return copy;
}
