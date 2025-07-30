import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Public routes that don't require authentication
        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/" ||
          pathname === "/contact" ||
          pathname === "/auth/login" ||
          pathname === "/auth/signup"
        ) {
          return true
        }

        // Protected routes require authentication
        if (
          pathname.startsWith("/dashboard") ||
          pathname.startsWith("/admin") ||
          pathname.startsWith("/api/dashboard") ||
          pathname.startsWith("/api/forms") ||
          pathname.startsWith("/api/feedback")
        ) {
          return !!token
        }

        // Admin routes require admin role
        if (pathname.startsWith("/admin")) {
          return token?.role === "admin"
        }

        return true
      },
    },
  },
)

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/api/dashboard/:path*", "/api/forms/:path*", "/api/feedback/:path*"],
}
