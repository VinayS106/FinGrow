import express from "express";
import { Report } from "../Classes/Report";
export const ReportsRouter = express.Router();

ReportsRouter.get("/report/:username", async (req, res) => {
    try {
        const report = new Report(req.params.username);
        const { startDate, endDate } = req.body;
        const totalIncomeAndExpenses = await report.totalIncomeAndExpenses(
            startDate,
            endDate
        );
        const budgetUsageSummary = await report.budgetUsageSummary();
        const progressPercentage = await report.savingsProgress();
        const finalreport = {
            totalIncomeAndExpenses,
            budgetUsageSummary,
            progressPercentage,
        };
        res.send(finalreport);
    } catch (e: any) {
        throw new Error("Error occured" + e.message);
    }
});

ReportsRouter.post("/income-expenses/:username", async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        const report = new Report(req.params.username);
        const result = await report.totalIncomeAndExpenses(
            new Date(startDate),
            new Date(endDate)
        );
        res.json(result);
    } catch (e: any) {
        throw new Error("Error occured" + e.message);
    }
});

ReportsRouter.get("/budget-summary/:username", async (req, res) => {
    try {
        const username = req.params.username;
        const report = new Report(username);
        const result = await report.budgetUsageSummary();
        res.json(result);
    } catch (e: any) {
        throw new Error("Error occured" + e.message);
    }
});

ReportsRouter.get("/savings-progress/:username", async (req, res) => {
    try {
        const username = req.params.username;
        const report = new Report(username);
        const result = await report.savingsProgress();
        res.json(result);
    } catch (e: any) {
        throw new Error("Error occured" + e.message);
    }
});
