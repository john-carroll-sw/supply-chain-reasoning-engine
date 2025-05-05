import { AzureOpenAI } from "openai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredVars = [
  "AZURE_OPENAI_ENDPOINT",
  "AZURE_OPENAI_API_KEY",
  "AZURE_OPENAI_DEPLOYMENT"
];

requiredVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.warn(`Missing required environment variable: ${varName}`);
  }
});

// Create Azure OpenAI client with updated SDK
const endpoint = process.env.AZURE_OPENAI_ENDPOINT || "";
const apiKey = process.env.AZURE_OPENAI_API_KEY || "";
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "o4-mini";
const modelName = process.env.AZURE_OPENAI_MODEL || "o4-mini";
const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-04-01-preview";

const options = { endpoint, apiKey, deployment, apiVersion };
export const openAIClient = new AzureOpenAI(options);

/**
 * Generates reasoning and recommendations for supply chain disruptions
 * @param disruptionType Type of disruption (e.g., stockout, route_closed)
 * @param currentState Current supply chain state
 * @param disruptionDetails Details about the disruption
 * @returns AI-generated reasoning and recommendations
 */
export async function reasonAboutDisruption(
  disruptionType: string,
  currentState: any,
  disruptionDetails: any
): Promise<{
  reasoning: string;
  recommendations: Array<{ title: string; description: string }>;
}> {
  try {
    // System message to guide the AI's reasoning
    const systemMessage = `You are a supply chain optimization expert.\nYour task is to analyze a supply chain disruption and provide reasoning and recommendations.\nFocus on practical solutions that minimize costs and delivery delays.\nAlways think step by step about:\n1. The immediate impact of the disruption\n2. Possible alternative routes or sources\n3. Trade-offs between different solutions\n4. Implementation timeline and difficulty\n\nReturn your analysis in a structured format with clear reasoning and 2-3 specific recommendations.`;

    // Create prompt with current state and disruption details
    const userMessage = `\nSupply Chain Disruption: ${disruptionType}\n\nCurrent Supply Chain State:\n${JSON.stringify(currentState, null, 2)}\n\nDisruption Details:\n${JSON.stringify(disruptionDetails, null, 2)}\n\nPlease analyze this situation and provide:\n1. Step-by-step reasoning about the impact\n2. 2-3 specific recommendations with clear actions\n`;

    // Call Azure OpenAI with updated SDK
    const response = await openAIClient.chat.completions.create({
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage }
      ],
      model: modelName,
      max_completion_tokens: 800
    });

    // Removed invalid error/status checks; rely on try/catch for error handling

    const content = response.choices[0].message.content || "";
    
    // Parse content to extract reasoning and recommendations
    // This is a simple parsing approach; could be made more robust in production
    const parts = content.split(/Recommendations:|Recommendation:/i);
    const reasoning = parts[0].trim();
    const recommendationText = parts[1]?.trim() || "";
    
    // Extract individual recommendations
    const recommendationRegex = /(\d+\.\s*[^:]+):\s*([^]*?)(?=\d+\.|$)/g;
    const recommendations: Array<{ title: string, description: string }> = [];
    
    let match;
    while ((match = recommendationRegex.exec(recommendationText)) !== null) {
      recommendations.push({
        title: match[1].trim(),
        description: match[2].trim()
      });
    }

    // Fallback if parsing fails
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