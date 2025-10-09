import { NextRequest, NextResponse } from "next/server";
import { composio } from "@/lib/composio/composio";
import { AzureOpenAI } from "openai";
import { v4 as uuidv4 } from "uuid";

/**
 * CONFIGURE AZURE OPENAI
 */
const openai = new AzureOpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
  endpoint: "https://aven-gpt.openai.azure.com/",
  deployment: "gpt-4o",
  apiVersion: "2024-12-01-preview",
});

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string; // ISO string for transport
  isTyping?: boolean;
}

/**
 * POST /api/calendar/events/getCalenderContext
 * Body:
 * {
 *   userId: string;
 *   connectedAccountId?: string;
 *   timeMin?: string;
 *   timeMax?: string;
 *   messages: Message[];
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, connectedAccountId, timeMin, timeMax, messages } = body;
    console.log("troget")
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Expected 'messages' to be an array of Message objects" },
        { status: 400 }
      );
    }

    const SYSTEM_PROMPT = `
      You are a smart assistant that helps users manage, analyze, and summarize their Google Calendar events.
      When the user asks for events, use the connected Google Calendar integration to fetch relevant data.
      Always respond clearly and helpfully to increase their productivity.
      If the user provides a time range, ensure you only fetch events within that range. If not provided,
      use ${timeMin || "the current time"} to ${timeMax || "the end of time"}.
    `;

    const tools = await composio.tools.get(userId, {
      toolkits: ["googlecalendar"],
    });

    // Convert messages to OpenAI format
    const formattedMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m: Message) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    const initialCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: formattedMessages as any,
      tools,
      tool_choice: "auto",
    });

    const responseMessage = initialCompletion.choices[0].message;

    if (responseMessage.tool_calls) {
      const toolResults = await composio.provider.handleToolCalls(
        userId,
        initialCompletion,
        { connectedAccountId: connectedAccountId || "" }
      );

      const summaryCompletion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "Summarize these Google Calendar events in a friendly, helpful, and concise way:",
          },
          { role: "user", content: JSON.stringify(toolResults) },
        ],
      });

      const summaryText = summaryCompletion.choices[0].message.content;

      const assistantMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: summaryText || "No summary available.",
        timestamp: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        message: assistantMessage,
        rawEvents: toolResults,
      });
    }

    // If no tools called, return direct response
    const assistantMessage: Message = {
      id: uuidv4(),
      role: "assistant",
      content: responseMessage.content || "No response available.",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: assistantMessage,
    });
  } catch (error: any) {
    console.error("Calendar API Error:", error);
    return NextResponse.json(
      { error: "Unexpected server error", details: error.message },
      { status: 500 }
    );
  }
}
