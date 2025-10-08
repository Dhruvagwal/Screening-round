import { NextRequest, NextResponse } from "next/server";
import { composio } from "@/lib/composio/composio";
interface GetCalendarListParams {
  userId: string;
  connectedAccountId?: string;
  maxResults?: number;
  showHidden?: boolean;
}

/**
 * GET method to fetch Google Calendar list using Composio
 */
async function getCalendarList(
  params: GetCalendarListParams
): Promise<NextResponse> {
  try {
    const {
      userId,
      connectedAccountId = "xxxx",
      maxResults,
      showHidden,
    } = params;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const calendarListResponse = await composio.tools.execute(
      "GOOGLECALENDAR_LIST_CALENDARS",
      {
        userId,
        connectedAccountId,
        arguments: {
          ...(maxResults && { maxResults }),
          ...(showHidden !== undefined && { showHidden }),
        },
      }
    );

    if (!calendarListResponse) {
      return NextResponse.json(
        { error: "Failed to fetch calendars from Google Calendar API" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: calendarListResponse,
      userId,
      connectedAccountId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching Google Calendars:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "Internal Server Error",
          message: error.message,
          details:
            process.env.NODE_ENV === "development" ? error.stack : undefined,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

/**
 * GET handler for the API route
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId =
      url.searchParams.get("userId") || "cxxxxx";
    const connectedAccountId =
      url.searchParams.get("connectedAccountId") || "xxxx";
    const maxResults = url.searchParams.get("maxResults")
      ? parseInt(url.searchParams.get("maxResults")!)
      : undefined;
    const showHidden = url.searchParams.get("showHidden") === "true";

    return await getCalendarList({
      userId: userId,
      connectedAccountId,
      maxResults,
      showHidden,
    });
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
