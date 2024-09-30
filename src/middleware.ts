import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Define unauthenticated and authenticated routes as Maps
const unauthenticatedRoutes = new Map<string, string>([
  ["/auth/login", "login"],
  ["/auth/register", "register"],
]);

// const authenticatedRoutes = new Map<string, string>([
//   ["dashboard", "/dashboard"],
//   ["signout", "/api/auth/signout"],
// ]);

// const allRoutesMatcher = () => {
//   return [
//     ...Array.from(unauthenticatedRoutes.values()),
//     ...Array.from(authenticatedRoutes.values()),
//   ];
// };

// Middleware function
export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // Allow signout route to proceed without session checks
  if (pathname === "/api/auth/signout") {
    return NextResponse.next();
  }

  const session = await getToken({ req: request });
  console.log(session);

  // If the user is authenticated but accessing an unauthenticated route, redirect to dashboard
  if (session && unauthenticatedRoutes.has(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If the user is not authenticated, and login is not fetched, redirect to login
  if (!session && pathname !== "/auth/login") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
};

// Fix the matcher by converting Map values to arrays wont work. Have to add manually
export const config = {
  matcher: ["/dashboard", "/api/auth/signout", "/auth/login"],
  //   matcher: allRoutesMatcher(),
};
