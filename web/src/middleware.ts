import { authMiddleware } from "@clerk/nextjs/server";

const publicPaths = ["/", "/sign-in", "/sign-up", "/api/trpc*", "/api/test"];

const isPublic = (path: string) => {
  return publicPaths.find((publicPath) =>
    path.match(new RegExp(`^${publicPath}$`.replace("*$", "($|/)")))
  );
};

export default authMiddleware({
  publicRoutes(req) {
    return isPublic(req.nextUrl.pathname) !== undefined;
  },
});

// export default withClerkMiddleware((req) => {
//   console.log(req.url);
//   return NextResponse.next();

//   if (isPublic(req.nextUrl.pathname)) {
//     return NextResponse.next();
//   }

//   const { userId } = getAuth(req);

//   if (!userId) {
//     const signInUrl = new URL("/sign-in", req.url);
//     signInUrl.searchParams.set("redirect_url", req.url);
//     return NextResponse.redirect(signInUrl);
//   }

//   return NextResponse.next();
// });

// Stop Middleware running on static files
export const config = {
  matcher: "/((?!_next/image|_next/static|favicon.ico).*)",
};
