import { NextRequest, NextResponse } from "next/server";
import { composio, provider } from "@/lib/composio/composio";
import { AzureOpenAI } from "openai";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const connectedAccountId = searchParams.get("connectedAccountId") || "xxx";
    const userId = searchParams.get("userId") || "xxx";
    const calendarId = searchParams.get("calendarId") || "primary";
    const timeMin = searchParams.get("timeMin");
    const timeMax = searchParams.get("timeMax");

    const tool = await composio.tools.get(userId, {
      tools: ["GOOGLECALENDAR_EVENTS_LIST"],
    });

    if (!tool || tool.length === 0) {
      return NextResponse.json(
        { error: "No Google Calendar tools found for this user" },
        { status: 400 }
      );
    }

    const prompt = `Please list only my meetings and appointments from my Google Calendar and do not include any other events${
      calendarId !== "primary" ? ` (${calendarId})` : ""
    }${
      timeMin || timeMax
        ? ` between ${timeMin || "now"} and ${timeMax || "end of time"}`
        : ""
    }. Include the title, start and end times, duration, attendees, and description, as well as the calendar name if available.`;

    // Using chat.completions.create instead of responses.create
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      tools: tool,
      model: "gpt-4o", // Make sure this matches your Azure deployment name
    });

    // Execute any tool calls requested by the AI
    const result = await composio.provider.handleToolCalls(userId, completion);
    const parsedResult = JSON.parse(result?.[0]?.content.toString());
    return NextResponse.json({
      success: true,
      data: parsedResult,
      userId,
      connectedAccountId,
      calendarId,
    });
  } catch (error) {
    console.error(
      "Error fetching or summarizing Google Calendar events:",
      error
    );

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

const deployment = "https://aven-gpt.openai.azure.com/";
const apiVersion = "2024-12-01-preview";

const openai = new AzureOpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
  deployment: "gpt-4o",
  endpoint: deployment,
  apiVersion: apiVersion,
});
