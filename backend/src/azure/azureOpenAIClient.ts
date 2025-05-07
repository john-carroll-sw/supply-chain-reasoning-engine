import { AzureOpenAI } from "openai";
import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const modelName = process.env.AZURE_OPENAI_MODEL || "o4-mini";
if (!modelName) throw new Error("AZURE_OPENAI_MODEL is required");
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

const options = { endpoint, apiKey, deployment, apiVersion };
export const AzureOpenAIClient = new AzureOpenAI(options);

export interface ReasoningResponse {
  reasoning: string;
  recommendations: Array<{ title: string; description: string }>;
}

export const ReasoningResponseSchema = z.object({
  reasoning: z.string(),
  recommendations: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    })
  ),
});

export async function callOpenAIChat(messages: any[], responseSchema?: z.ZodTypeAny): Promise<any> {
  const params: any = {
    messages,
    max_completion_tokens: 10000,
    model: modelName,
    temperature: 0.1,
  };

  if (responseSchema) {
    params.response_format = { schema: responseSchema };
  }

  const response = await AzureOpenAIClient.beta.chat.completions.parse(params);

  if (!response.choices || response.choices.length === 0) {
    throw new Error("No response from Azure OpenAI");
  }

  return response.choices[0].message.parsed;
}