import express from "express";
import { budgetRouter } from "./budgetRouter";
import { userRouter } from "./userRouter";
import { savingsRouter } from "./savingsRouter";
import { TransactionRouter } from "./transactionRouter";
import { ReportsRouter } from "./reportsRouter";

export const router = express.Router();

router.use('/api', userRouter);
router.use('/api', savingsRouter);
router.use('/api',budgetRouter);
router.use('/api',TransactionRouter);
router.use('/api',ReportsRouter)
