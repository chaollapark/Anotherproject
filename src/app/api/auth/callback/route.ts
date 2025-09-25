import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Authentication removed - redirect to home page
  return NextResponse.redirect(new URL('/', request.url));
}
