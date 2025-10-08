import { NextRequest, NextResponse } from "next/server";
import { composio } from "@/lib/composio/composio";

export async function POST(req: NextRequest) {
  try {
    const { userId, callbackUrl } = await req.json();
    const authConfigId = process.env.NEXT_PUBLIC_COMPOSIO_AUTH_CONFIG_ID;
    if (!userId || !authConfigId || !callbackUrl) {
      return NextResponse.json(
        { error: "Missing userId, authConfigId, or callbackUrl" },
        { status: 400 }
      );
    }

    const connectionRequest = await composio.connectedAccounts.link(
      userId,
      authConfigId,
      { callbackUrl }
    );

    return NextResponse.json(connectionRequest);
  } catch (error) {
    console.error("Server-side Composio error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 }
    );
  }
}
