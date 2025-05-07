import { Request, Response } from 'express';
import { supplyChain } from '../data/supplyChain';
import { reasonAboutDisruption } from '../azure/reasoningService';
import { detectDisruptions } from './supplyChainController';

/**
 * POST /api/reason
 * Generate reasoning and recommendations for the current supply chain state
 */
export const postReasonAboutDisruption = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get current supply chain state to send to the AI
    const currentState = supplyChain;

    // Get disruptions using the same logic as the UI
    // @ts-ignore: access to detectDisruptions (exported below)
    const disruptions = detectDisruptions(currentState, (global as any).closedBridges || []);

    // Call Azure OpenAI to reason about the current state and disruptions
    const result = await reasonAboutDisruption({ state: currentState, disruptions });

    // Only return the parsed reasoning output (reasoning + recommendations)
    const parsed = result?.output_parsed || result;
    res.json({
      status: 'ok',
      data: parsed
    });
  } catch (error) {
    console.error('Error generating reasoning:', error);
    res.status(500).json({
      status: 'error',
      message: (error as Error).message || 'Failed to generate reasoning'
    });
  }
};

// Export detectDisruptions for use in other controllers
export { detectDisruptions };