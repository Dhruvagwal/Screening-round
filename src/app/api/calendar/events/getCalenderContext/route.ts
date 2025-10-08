import { NextRequest, NextResponse } from "next/server";
import { composio } from "@/lib/composio/composio";
import { AzureOpenAI } from "openai";

/**
 * SYSTEM PROMPT:
 * Guides the model to use Composio tools effectively and produce useful summaries.
 */
const SYSTEM_PROMPT = `
You are a smart assistant that helps users manage, analyze, and summarize their Google Calendar events.
When the user asks for events, use the connected Google Calendar integration to fetch relevant data.
Always respond clearly and helpfully to increase their productivity.
`;

/**
 * CONFIGURE AZURE OPENAI
 */
const openai = new AzureOpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
  endpoint: "https://aven-gpt.openai.azure.com/",
  deployment: "gpt-4o",
  apiVersion: "2024-12-01-preview",
});

/**
 * GET /api/calendar
 * Query parameters:
 *  - userId: user's unique composio identifier
 *  - prompt: natural language query from user (e.g., "Summarize my next 30 days of meetings")
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const userPrompt =
      searchParams.get("prompt") ||
      "Show me all meetings and events in the next 30 days.";

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId in query parameters" },
        { status: 400 }
      );
    }

    // Step 1: Load Google Calendar tools for the given user
    const tools = await composio.tools.get(userId, {
      toolkits: ["googlecalendar"],
    });

    // Step 2: Ask the model how to proceed (and allow tool use)
    const initialCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      tools,
      tool_choice: "auto", // model decides whether to use tools
    });

    const responseMessage = initialCompletion.choices[0].message;

    //  Step 3: If the model called any tools, execute them through Composio
    if (responseMessage.tool_calls) {
      const toolResults = await composio.provider.handleToolCalls(
        userId,
        initialCompletion
      );

      //  Step 4: Summarize fetched calendar data
      const summaryCompletion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "Summarize these Google Calendar events in a friendly, helpful, and concise way:",
          },
          {
            role: "user",
            content: JSON.stringify(toolResults),
          },
        ],
      });

      return NextResponse.json({
        success: true,
        summary: summaryCompletion.choices[0].message.content,
        rawEvents: toolResults,
      });
    }

    //  Step 5: If no tools were called, return the model’s direct response
    return NextResponse.json({
      success: true,
      summary: responseMessage.content,
    });
  } catch (error: any) {
    console.error("Calendar API Error:", error);

    // Handle specific Composio errors more gracefully
    if (error?.response?.status === 404) {
      return NextResponse.json(
        {
          error:
            "Google Calendar tool not found. Please ensure 'googlecalendar' toolkit is connected for this user.",
          details: error.response.data,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Unexpected server error", details: error.message },
      { status: 500 }
    );
  }
}
