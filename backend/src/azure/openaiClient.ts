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
export const openAIClient = new AzureOpenAI(options);

export async function reasonAboutDisruption(
  disruptionType: string,
  currentState: any,
  disruptionDetails: any
): Promise<{
  reasoning: string;
  recommendations: Array<{ title: string; description: string }>;
}> {
  try {
    const systemMessage = `You are a supply chain optimization expert.\nYour task is to analyze a supply chain disruption and provide reasoning and recommendations.\nFocus on practical solutions that minimize costs and delivery delays.\nAlways think step by step about:\n1. The immediate impact of the disruption\n2. Possible alternative routes or sources\n3. Trade-offs between different solutions\n4. Implementation timeline and difficulty\n\nReturn your analysis in a structured format with clear reasoning and 2-3 specific recommendations.`;

    const userMessage = `\nSupply Chain Disruption: ${disruptionType}\n\nCurrent Supply Chain State:\n${JSON.stringify(currentState, null, 2)}\n\nDisruption Details:\n${JSON.stringify(disruptionDetails, null, 2)}\n\nPlease analyze this situation and provide:\n1. Step-by-step reasoning about the impact\n2. 2-3 specific recommendations with clear actions\n`;

    const response = await openAIClient.chat.completions.create({
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage }
      ],
      max_completion_tokens: 800,
      model: modelName // modelName is now always a string
    });

    if (!response.choices || response.choices.length === 0) {
      throw new Error("No response from Azure OpenAI");
    }

    const content = response.choices[0].message?.content || "";
    const parts = content.split(/Recommendations:|Recommendation:/i);
    const reasoning = parts[0].trim();
    const recommendationText = parts[1]?.trim() || "";
    const recommendationRegex = /(\d+\.\s*[^:]+):\s*([^]*?)(?=\d+\.|$)/g;
    const recommendations: Array<{ title: string, description: string }> = [];
    let match;
    while ((match = recommendationRegex.exec(recommendationText)) !== null) {
      recommendations.push({
        title: match[1].trim(),
        description: match[2].trim()
      });
    }
    if (recommendations.length === 0 && recommendationText) {
      recommendations.push({
        title: "Recommendation",
        description: recommendationText
      });
    }
    return { reasoning, recommendations };
  } catch (error) {
    console.error("Error in Azure OpenAI reasoning:", error);
    throw new Error(`Failed to generate reasoning: ${(error as Error).message}`);
  }
}