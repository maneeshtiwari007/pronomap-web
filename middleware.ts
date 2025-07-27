import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "./lib/session";

// 1. Specify protected and public routes
const protectedRoutes = [
  "/profile/business/enquiry",
  "/profile/business/manage-services",
  "/profile/business/edit",
  "/profile/user",
  "/profile/business",
  "/profile/business/business-details",
  "/profile/business/services",
  "/profile/business/gallery",
  "/profile/user/edit",
  "/profile/user/enquiries",
];
const publicRoutes = ["/login", "/signup"];
const businessProtectedRoutes = [
  "/profile/business/enquiry",
  "/profile/business/manage-services",
  "/profile/business/edit",
  "/profile/business",
  "/profile/business/business-details",
  "profile/business/services",
  "profile/business/gallery",
];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const currentDate: any = new Date();
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
  //console.log(path);
  // 3. Decrypt the session from the cookie
  const cookie = await getSession();
  const session: any = cookie;
  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.data) {
    if (path?.includes("/business")) {
      return NextResponse.redirect(new URL("/login/business", req.nextUrl));
    } else {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
  }
  if (isProtectedRoute && session?.data) {
    if (session?.data?.type === "user") {
      if (businessProtectedRoutes?.includes(path)) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
      }
    }
    // if (session?.data?.trigger === "step1" && path!=='/profile/business/business-details') {
    //   return NextResponse.redirect(
    //     new URL("/profile/business/business-details", req.nextUrl)
    //   );
    // }
  }

  // 5. Redirect to /dashboard if the user is authenticated
  if (isPublicRoute && session?.data) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
