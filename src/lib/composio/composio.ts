import { Composio } from "@composio/core";
import { OpenAIProvider } from "@composio/openai";
import { AzureOpenAI } from "openai";
export const provider = new OpenAIProvider();
export const composio = new Composio({
  apiKey: process.env.NEXT_PUBLIC_COMPOSIO_API_KEY!,
  provider,
});