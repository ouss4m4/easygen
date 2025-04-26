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

export async function api<T>(method: HTTPMethod, path: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, body, ...rest } = options;
  const url = `${BASE_URL}${path}${buildQueryString(params)}`;

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  const response: ApiErrorResponse | T = await res.json();

  if (!res.ok) {
    const { error, message, statusCode } = response as ApiErrorResponse;
    const errorMessage = typeof message == "string" ? message : message.join(" - ");
    // sentry would be a candidate here
    console.log(`${error} - ${statusCode} - ${message}`);
    throw new Error(errorMessage);
  }

  return response as T;
}
