import { createAuthClient } from "better-auth/react";
import { url } from "../url";

export const authClient = createAuthClient({
  baseURL: url(),
});