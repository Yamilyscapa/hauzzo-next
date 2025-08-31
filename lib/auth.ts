import { useSessionStore } from "@/store/session-store";
import { apiFetch } from "@/lib/http";

export async function auth(
  role: "broker" | "user",
  email: string,
  password: string,
) {
  const response = await apiFetch(`/auth/${role}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }, { skipRefresh: true });

  if (response.status === 401) {
    throw new Error("Unauthorized");
  }
  if (!response.ok) {
    throw new Error("Failed to authenticate");
  }

  const { data } = await response.json();

  if (!data) {
    throw new Error("Failed to authenticate: " + response.statusText);
  }

  if (response.status === 401) {
    throw new Error("Unauthorized");
  }

  const { broker } = data;

  useSessionStore.setState({
    user: broker,
    role: role,
    isAuthenticated: true,
  });

  return broker;
}

export async function checkAuth(role: "broker" | "user"): Promise<boolean> {
  const response = await apiFetch(`/auth/${role}/me`);

  if (!response.ok) {
    useSessionStore.setState({
      user: null,
      role: null,
      isAuthenticated: false,
    });
    return false;
  }

  const { data } = await response.json();

  if (!data) {
    useSessionStore.setState({
      user: null,
      role: null,
      isAuthenticated: false,
    });
    return false;
  }

  useSessionStore.setState({ user: data, role: role, isAuthenticated: true });

  return true;
}

export async function logout(
  role: "broker" | "user" = "broker",
): Promise<boolean> {
  try {
    const response = await apiFetch(`/auth/${role}/logout`, { method: "POST" }, { skipRefresh: true });

    if (!response.ok) {
      return false;
    }

    useSessionStore.setState({
      user: null,
      role: null,
      isAuthenticated: false,
    });
    return true;
  } catch {
    return false;
  }
}
