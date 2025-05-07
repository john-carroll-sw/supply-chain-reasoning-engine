import { callOpenAIChat, ReasoningResponseSchema, ReasoningResponse } from "./azureOpenAIClient";
import fs from "fs/promises";

export async function reasonAboutDisruption(input: { state: any; disruptions: any[] }): Promise<ReasoningResponse> {
  // Load prompts
  const systemMessage = await fs.readFile(
    __dirname + "/../../prompts/reason_about_disruption.system.txt",
    "utf-8"
  );
  const userMessage = await fs.readFile(
    __dirname + "/../../prompts/reason_about_disruption.user.txt",
    "utf-8"
  );
  // Fill in placeholders
  const userMessageWithContext = userMessage
    .replace("{{currentState}}", JSON.stringify(input.state, null, 2))
    .replace("{{disruptions}}", JSON.stringify(input.disruptions, null, 2));
  // Console logs for debugging
  console.log("[Azure OpenAI system message]", systemMessage);
  console.log("[Azure OpenAI user message]", userMessageWithContext);
  // Call OpenAI with structured output schema
  const result = await callOpenAIChat(
    [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessageWithContext }
    ],
    ReasoningResponseSchema
  );
  console.log("[Azure OpenAI structured output]", result);
  return result;
}
