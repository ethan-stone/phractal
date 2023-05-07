import { authMiddleware } from "@clerk/nextjs/server";

const publicPaths = ["/", "/sign-in", "/sign-up", "/api/trpc*", "/api/notes"];

const isPublic = (path: string) => {
  return publicPaths.find((publicPath) =>
    path.match(new RegExp(`^${publicPath}$`.replace("*$", "($|/)")))
  );
};

export default authMiddleware({
  publicRoutes(req) {
    const result = isPublic(req.nextUrl.pathname) !== undefined;
    console.log(result);
    return result;
  },
});

// Stop Middleware running on static files
export const config = {
  matcher: "/((?!_next/image|_next/static|favicon.ico).*)",
};
