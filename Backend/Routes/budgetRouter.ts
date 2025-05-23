import express from "express";
import { Budget } from "../Classes/Budget";

export const budgetRouter = express.Router();

budgetRouter.post("/budget/:username", async (req, res) => {
    try {
        const budget = new Budget(req.params.username);
        const { title, target } = req.body;
        if (!title || !target) {
            res.status(400).send("Form Incomplete");
            return;
        }
        const result = await budget.createBudget(title, target);
        if (result === `Added budget ${title} successfully`) {
            res.status(200).send(result);
        } else {
            res.status(500).send(`Error adding budget`);
        }
    } catch (error: any) {
        throw new Error("Error creating budget: " + error.message);
    }
});
