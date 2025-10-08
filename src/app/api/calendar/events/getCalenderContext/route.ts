import { NextRequest, NextResponse } from "next/server";
import { composio } from "@/lib/composio/composio";
import { AzureOpenAI } from "openai";
const prompt = `
You are an assistant that helps users manage and summarize their Google Calendar events.
Your task is to help the user by fetching and summarizing events from their specified Google Calendar.
and increase his productivity.`;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "xxx";
    const propmt = searchParams.get("propmt") || "xxx";

    const tools = await composio.tools.get(userId, {
      toolkits: ["GOOGLECALENDAR"],
    });

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: propmt,
        },
      ],
      tools: tools,
      model: "gpt-4o",
      tool_choice: "auto", // Explicitly tell the model it can use tools
    });

    const responseMessage = completion.choices[0].message;
    // If there are tool calls, handle them
    if (responseMessage.tool_calls) {
      // Handle the tool calls and get calendar data
      const toolResults = await composio.provider.handleToolCalls(
        userId,
        completion
      );

      // Make another completion to summarize the calendar data
      const summaryCompletion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "Summarize these calendar events in a friendly way:",
          },
          {
            role: "user",
            content: JSON.stringify(toolResults),
          },
        ],
        model: "gpt-4o",
      });
      return NextResponse.json({
        success: true,
        data: summaryCompletion.choices[0].message.content,
      });
    }

    return NextResponse.json({
      success: true,
      data: responseMessage.content,
    });
  } catch (error) {
    console.error("Error:", error);
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
