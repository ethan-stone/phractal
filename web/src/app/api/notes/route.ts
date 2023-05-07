import { auth } from "@clerk/nextjs";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

const searchParamsSchema = z.object({
  limit: z
    .string()
    .default("25")
    .transform((s) => parseInt(s)),
  startingAfter: z.string().nullish(),
});

export async function GET(req: NextRequest) {
  const searchParams = await searchParamsSchema.spa({
    limit: req.nextUrl.searchParams.get("limit"),
    startingAfter: req.nextUrl.searchParams.get("startingAfter"),
  });

  if (!searchParams.success) {
    console.log(searchParams.error);
    return NextResponse.json(
      {},
      {
        status: 400,
      }
    );
  }

  return NextResponse.json({});
}

/**
 * create a new note
 */
export function POST() {
  const { userId } = auth();

  console.log(userId);

  return NextResponse.json({});
}
