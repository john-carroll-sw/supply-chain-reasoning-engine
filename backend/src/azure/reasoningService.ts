import fs from "fs/promises";
import { callOpenAIChat } from "./azureOpenAIClient";

export async function reasonAboutDisruption(input: { state: any; disruptions: any[] }) {
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
  // Compose the state and disruptions for the prompt
  const userMessageWithContext = userMessage
    .replace("{{currentState}}", JSON.stringify(input.state, null, 2))
    .replace("{{disruptions}}", JSON.stringify(input.disruptions, null, 2));
  console.log("[Azure OpenAI system prompt]", systemMessage);
  console.log("[Azure OpenAI user prompt]", userMessageWithContext);
  // Call OpenAI
  const content = await callOpenAIChat([
    { role: "system", content: systemMessage },
    { role: "user", content: userMessageWithContext }
  ]);
  // Log the raw model output for debugging
  console.log("[Azure OpenAI raw output]", content);
  // Parse output
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
  if (!reasoning && !recommendations.length && content) {
    return { reasoning: content, recommendations: [{ title: "Recommendation", description: content }] };
  }
  return { reasoning, recommendations };
}
