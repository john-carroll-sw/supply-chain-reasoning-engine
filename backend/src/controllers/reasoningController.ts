import { Request, Response } from 'express';
import { supplyChain } from '../data/supplyChain';
import { reasonAboutDisruption } from '../azure/azureOpenAIClient';

/**
 * POST /api/reason
 * Generate reasoning and recommendations for a supply chain disruption
 */
export const postReasonAboutDisruption = async (req: Request, res: Response): Promise<void> => {
  try {
    const { disruptionType, details } = req.body;
    
    if (!disruptionType) {
      res.status(400).json({ status: 'error', message: 'Missing disruption type' });
      return;
    }

    // Get current supply chain state to send to the AI
    const currentState = supplyChain;
    
    // Call Azure OpenAI to reason about the disruption
    const result = await reasonAboutDisruption(
      disruptionType,
      currentState,
      details || {}
    );
    
    res.json({
      status: 'ok',
      data: result
    });
  } catch (error) {
    console.error('Error generating reasoning:', error);
    res.status(500).json({
      status: 'error',
      message: (error as Error).message || 'Failed to generate reasoning'
    });
  }
};