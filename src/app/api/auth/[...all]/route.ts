import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
4 | console.log("✅ Auth API Route Loaded!");

export const { POST, GET } = toNextJsHandler(auth);