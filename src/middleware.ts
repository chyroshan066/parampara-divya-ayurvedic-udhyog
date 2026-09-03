import type { NextRequest } from "next/server";
import { adminAuthMiddleware } from "@/middlewares/admin-auth";

export function middleware(request: NextRequest) {
  return adminAuthMiddleware(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};