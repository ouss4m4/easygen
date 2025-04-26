import { LoginResponse } from "./typings";

const BASE_URL = (import.meta.env.VITE_API_URL || "") + "/api/v1";

type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  params?: Record<string, string | number | boolean>;
  body?: unknown;
}

function buildQueryString(params?: Record<string, string | number | boolean>): string {
  if (!params) return "";
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    query.append(key, value.toString());
  });
  return `?${query.toString()}`;
}

export async function api<T>(method: HTTPMethod, path: string, options: RequestOptions = {}, refresh = true): Promise<T> {
  const { params, headers, body, ...rest } = options;
  const url = `${BASE_URL}${path}${buildQueryString(params)}`;
  const token = localStorage.getItem("accessToken");

  const res = await fetch(url, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  const response: ApiErrorResponse | T = await res.json();
  // Simulate timeout for frontend state
  await new Promise((res) => setTimeout(res, 800));
  if (!res.ok) {
    const { error, message, statusCode } = response as ApiErrorResponse;
    if ((statusCode === 401 || statusCode === 403) && refresh) {
      try {
        const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, { credentials: "include" });
        if (refreshRes.ok) {
          // should we bring context here?
          const data: LoginResponse = await refreshRes.json();
          localStorage.setItem("accessToken", data.accessToken);
          return await api<T>(method, path, options); // retry original request
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
      }
    }

    const errorMessage = typeof message == "string" ? message : message.join(" - ");
    console.log(`${error} - ${statusCode} - ${message}`);
    throw new Error(errorMessage);
  }

  return response as T;
}
