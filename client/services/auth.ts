export type LoginPayload = { email: string; password: string };
export type RegisterPayload = { name: string; email: string; password: string };

function wait(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function login(payload: LoginPayload) {
  await wait(600);
  if (payload.email === "demo@roombridge.app" && payload.password === "password") {
    return { token: "demo-token", user: { id: "u1", name: "Demo User", email: payload.email } };
  }
  // mimic invalid credentials
  throw new Error("Invalid email or password");
}

export async function register(payload: RegisterPayload) {
  await wait(800);
  // pretend user is created successfully
  return { id: "u2", name: payload.name, email: payload.email };
}

