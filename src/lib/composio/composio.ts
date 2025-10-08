import { Composio } from "@composio/core";

export const composio = new Composio({
  apiKey: process.env.NEXT_PUBLIC_COMPOSIO_API_KEY!,
});
