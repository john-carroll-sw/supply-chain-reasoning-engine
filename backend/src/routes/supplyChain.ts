import { Router, Request, Response } from 'express';
import { getSupplyChain, postDisrupt } from '../controllers/supplyChainController';

const router = Router();

// GET /api/supplychain
router.get('/', getSupplyChain);

// POST /api/supplychain/disrupt
router.post('/disrupt', postDisrupt);

export default router;
