import { AzureOpenAI } from "openai";
import dotenv from "dotenv";
import fs from "fs/promises";
dotenv.config();

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const modelName = process.env.AZURE_OPENAI_MODEL || "o4-mini";
if (!modelName) throw new Error("AZURE_OPENAI_MODEL is required");
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

const options = { endpoint, apiKey, deployment, apiVersion };
export const AzureOpenAIClient = new AzureOpenAI(options);

export async function reasonAboutDisruption(
  input: { state: any; disruptions: any[] }
): Promise<{
  reasoning: string;
  recommendations: Array<{ title: string; description: string }>;
}> {
  try {
    // Load the system and user prompts from file
    const systemMessage = await fs.readFile(
      __dirname + "/../../prompts/reason_about_disruption.system.txt",
      "utf-8"
    );
    const userMessage = await fs.readFile(
      __dirname + "/../../prompts/reason_about_disruption.user.txt",
      "utf-8"
    );
    console.log("[Azure OpenAI system prompt]", systemMessage);
    // Compose the state and disruptions for the prompt
    const userMessageWithContext = userMessage
      .replace("{{currentState}}", JSON.stringify(input.state, null, 2))
      .replace("{{disruptions}}", JSON.stringify(input.disruptions, null, 2));

    console.log("[Azure OpenAI user prompt]", userMessageWithContext);
    const response = await AzureOpenAIClient.chat.completions.create({
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessageWithContext }
      ],
      max_completion_tokens: 10000,
      model: modelName
    });

    if (!response.choices || response.choices.length === 0) {
        throw new Error("No response from Azure OpenAI");
    }
    
    const content = response.choices[0].message?.content || "";
    // Log the raw model output for debugging
    console.log("[Azure OpenAI raw output]", content);
    
    // Improved parsing: look for 'Reasoning:' and 'Recommendations (ranked):'
    let reasoning = "";
    let recommendations: Array<{ title: string, description: string }> = [];
    const reasoningMatch = content.match(/Reasoning:(.*?)(Recommendations \(ranked\):|$)/is);
    if (reasoningMatch) {
      reasoning = reasoningMatch[1].trim();
    }
    const recsMatch = content.match(/Recommendations \(ranked\):(.*)$/is);
    if (recsMatch) {
      const recLines = recsMatch[1].split(/\n|\r/);
      let currentRec: { title: string, description: string } | null = null;
      for (const line of recLines) {
        const recMatch = line.match(/^(\d+)\.\s*(.*)$/);
        if (recMatch) {
          if (currentRec) recommendations.push(currentRec);
          currentRec = { title: `Recommendation ${recMatch[1]}`, description: recMatch[2].trim() };
        } else if (currentRec && (line.match(/^\s*[-•]/) || line.match(/^\s{2,}/))) {
          currentRec.description += '\n' + line.trim();
        } else if (currentRec && line.trim() !== "") {
          currentRec.description += ' ' + line.trim();
        }
      }
      if (currentRec) recommendations.push(currentRec);
    }
    // Fallback: if parsing fails, return the whole output as a single recommendation
    if (!reasoning && !recommendations.length && content) {
      return { reasoning: content, recommendations: [{ title: "Recommendation", description: content }] };
    }
    return { reasoning, recommendations };
  } catch (error) {
    console.error("Error in Azure OpenAI reasoning:", error);
    throw new Error(`Failed to generate reasoning: ${(error as Error).message}`);
  }
}