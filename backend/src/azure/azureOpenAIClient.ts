import { AzureOpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const modelName = process.env.AZURE_OPENAI_MODEL || "o4-mini";
if (!modelName) throw new Error("AZURE_OPENAI_MODEL is required");
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

const options = { endpoint, apiKey, deployment, apiVersion };
export const AzureOpenAIClient = new AzureOpenAI(options);

export async function callOpenAIChat(messages: any[]): Promise<string> {
  const response = await AzureOpenAIClient.chat.completions.create({
    messages,
    max_completion_tokens: 10000,
    model: modelName
  });
  if (!response.choices || response.choices.length === 0) {
    throw new Error("No response from Azure OpenAI");
  }
  return response.choices[0].message?.content || "";
}