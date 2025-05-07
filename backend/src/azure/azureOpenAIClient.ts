import OpenAI, { AzureOpenAI } from "openai";
import dotenv from "dotenv";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

dotenv.config();

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const modelName = process.env.AZURE_OPENAI_MODEL || "o4-mini";
if (!modelName) throw new Error("AZURE_OPENAI_MODEL is required");
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

const options = { endpoint, apiKey, deployment, apiVersion };
export const AzureOpenAIClient = new AzureOpenAI(options);

export const ReasoningResponseSchema = z.object({
  reasoning: z.string(),
  recommendations: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    })
  ),
});
export type ReasoningResponse = z.infer<typeof ReasoningResponseSchema>;

export async function parseReasoningResponse(systemMessage: string, userMessage: string): Promise<ReasoningResponse> {
  const completion = await AzureOpenAIClient.beta.chat.completions.parse({
    model: process.env.AZURE_OPENAI_DEPLOYMENT!,
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage },
    ],
    response_format: zodResponseFormat(ReasoningResponseSchema, "reasoning_response"),
  });

  if (!completion.choices || completion.choices.length === 0) {
    throw new Error("No response from Azure OpenAI");
  }
  // Defensive: If the model fails to return a valid object, throw an error
  const parsed = completion.choices[0].message.parsed;
  if (!parsed) {
    throw new Error("No structured output returned from LLM");
  }
  return parsed;
}