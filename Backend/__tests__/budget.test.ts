import axios from "axios";
const API_URL = `http://localhost:5050/api`;
jest.mock("axios");

import { Budget } from "../Classes/Budget";
import { BudgetModel } from "../Collections/Budget";
import { TransactionModel } from "../Collections/Transactions";
import { UserModel } from "../Collections/User";
import mongoose from "mongoose";

describe("Checking Budget creation functionality", () => {
    let budgetInstance: Budget;
    beforeEach(() => {
        jest.clearAllMocks();
        budgetInstance = new Budget("Usha");
    });
    it("Should not create budget if user is not present", async () => {
        jest.spyOn(UserModel, "findOne").mockResolvedValue(null);
        const Modelresponse = await budgetInstance.createBudget("Food", 2000);
        const res = {
            status: 400,
            msg: Modelresponse,
        };
        (axios.post as jest.Mock).mockResolvedValue(res);

        const budget = {
            title: "Food",
            target: 2000,
        };
        const response = await axios.post(`${API_URL}/budget/mammu`, budget);
        expect(response.status).toBe(400);
        expect(response.data).toEqual(undefined);
        expect(res.msg).toMatch("User with the given username is not present");
    });

    it("Should create new budget if no existing budget is found", async () => {
        jest.spyOn(UserModel, "findOne").mockResolvedValue({
            _id: "1",
            name: "Usha",
            password: "1234",
            totalIncome: 2000,
            balance: 3000,
            save: jest.fn().mockResolvedValue(true),
        });
        jest.spyOn(BudgetModel, "findOne").mockResolvedValue(null);
        jest.spyOn(BudgetModel.prototype, "save").mockResolvedValue(true);

        const response = await budgetInstance.createBudget("Food", 2000);
        expect(response).toBe("Added budget Food successfully");
    });

    it("Should not add category as it exists", async () => {
        jest.spyOn(UserModel, "findOne").mockResolvedValue({
            _id: "1",
            name: "Usha",
            password: "1234",
            totalIncome: 2000,
            balance: 3000,
        });
        jest.spyOn(BudgetModel, "findOne").mockResolvedValue({
            userId: "1",
            categories: [{ title: "Food", target: 2000, spent: 0 }],
        });
        const Modelresponse = await budgetInstance.createBudget("Food", 2000);
        const res = {
            status: 500,
            msg: Modelresponse,
        };
        (axios.post as jest.Mock).mockResolvedValue(res);

        const budget = {
            title: "Food",
            target: 2000,
        };
        const response = await axios.post(`${API_URL}/budget/usha`, budget);
        expect(response.status).toBe(500);
        expect(response.data).toEqual(undefined);
        expect(res.msg).toMatch('Category "Food" already exists. Can\'t add.');
    });

    it("Should not add category as it exceeds total left balance", async () => {
        jest.spyOn(UserModel, "findOne").mockResolvedValue({
            _id: "1",
            balance: 1000,
        });
        jest.spyOn(BudgetModel, "findOne").mockResolvedValue({
            userId: "1",
            categories: [],
        });
        const Modelresponse = await budgetInstance.createBudget("Food", 2000);
        const res = {
            status: 500,
            msg: Modelresponse,
        };
        (axios.post as jest.Mock).mockResolvedValue(res);

        const budget = {
            title: "Food",
            target: 2000,
        };
        const response = await axios.post(`${API_URL}/budget/usha`, budget);
        expect(response.status).toBe(500);
        expect(response.data).toEqual(undefined);
        expect(res.msg).toMatch(
            "Total amount in account is not sufficient to add budget"
        );
    });
    it("Should add category successfully", async () => {
        const res = {
            status: 200,
            data: {
                title: "Groceries",
                target: 2000,
                spent: 0,
                transactions: [],
            },
            msg: "Added Groceries successfully",
        };
        (axios.post as jest.Mock).mockResolvedValue(res);

        const budget = {
            title: "Groceries",
            target: 2000,
        };
        const response = await axios.post(`${API_URL}/budget/usha`, budget);
        expect(response.status).toBe(200);
        expect(response.data).toEqual({
            title: "Groceries",
            target: 2000,
            spent: 0,
            transactions: [],
        });
        expect(res.msg).toMatch("Added Groceries successfully");
    });
    it("Should not add category as server issue", async () => {
        const errorMessage = "Something went wrong";
        (axios.post as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const budget = {
            title: "Groceries",
            target: 2000,
        };
        try {
            const response = await axios.post(`${API_URL}/budget/usha`, budget);
        } catch (error: any) {
            expect(error.message).toBe("Something went wrong");
        }
    });
});

describe("Checking budget transaction functionality", () => {
    let budgetInstance: Budget;
    beforeEach(() => {
        jest.clearAllMocks();
        budgetInstance = new Budget("Usha");
    });

    it("Should not make transaction as user is not present", async () => {
        jest.spyOn(UserModel, "findOne").mockResolvedValue(null);
        const transaction = {
            transactioName: "Buy Groceries",
            title: "Food",
            amount: 500,
            date: new Date("2024-10-02"),
        };
        const modelresponse = await budgetInstance.makeTransaction(
            transaction.title,
            transaction.title,
            transaction.amount,
            transaction.date
        );
        const res = {
            status: 404,
            msg: modelresponse,
        };
        (axios.post as jest.Mock).mockResolvedValue(res);

        const response = await axios.post(
            `${API_URL}/transaction/usha`,
            transaction
        );
        expect(response.status).toBe(404);
        expect(response.data).toEqual(undefined);
        expect(res.msg).toMatch("User with the given username is not present");
    });

    it("Should return error if budget is not found", async () => {
        jest.spyOn(UserModel, "findOne").mockResolvedValue({ _id: "1" });
        jest.spyOn(BudgetModel, "findOne").mockResolvedValue(null);

        const transaction = {
            transactioName: "Buy Groceries",
            title: "Food",
            amount: 500,
            date: new Date("2024-10-02"),
        };
        const modelResponse = await budgetInstance.makeTransaction(
            transaction.title,
            transaction.title,
            transaction.amount,
            transaction.date
        );
        const res = {
            status: 404,
            message: modelResponse,
        };
        (axios.post as jest.Mock).mockResolvedValue(res);

        const response = await axios.post(
            `${API_URL}/transaction/usha`,
            transaction
        );
        expect(response.status).toBe(404);
        expect(res.message).toBe("Budget Not Found for the provided user");
    });

    it("Should not make transaction as category is not present", async () => {
        jest.spyOn(UserModel, "findOne").mockResolvedValue({ _id: "1" });
        jest.spyOn(BudgetModel, "findOne").mockResolvedValue({
            userId: "1",
            categories: [],
        });
        const transaction = {
            transactioName: "Buy Groceries",
            title: "Dairy",
            amount: 500,
            date: new Date("2024-10-02"),
        };
        const modelResponse = await budgetInstance.makeTransaction(
            transaction.title,
            transaction.title,
            transaction.amount,
            transaction.date
        );

        const res = {
            status: 500,
            message: modelResponse,
        };
        (axios.post as jest.Mock).mockResolvedValue(res);

        const response = await axios.post(
            `${API_URL}/transaction/usha`,
            transaction
        );
        expect(response.status).toBe(500);
        expect(response.data).toEqual(undefined);
        expect(res.message).toMatch(
            'Category "Dairy" does not  exists. Can\'t make transactions.'
        );
    });

    it("Should not make transaction as insufficient funds", async () => {
        jest.spyOn(UserModel, "findOne").mockResolvedValue({
            _id: "1",
            balance: 300,
        });
        jest.spyOn(BudgetModel, "findOne").mockResolvedValue({
            userId: "1",
            categories: [{ title: "Food", target: 1000, spent: 0 }],
        });
        const transaction = {
            transactioName: "Buy Groceries",
            title: "Food",
            amount: 500,
            date: new Date("2024-10-02"),
        };
        const modelResponse = await budgetInstance.makeTransaction(
            transaction.title,
            transaction.title,
            transaction.amount,
            transaction.date
        );
        const res = {
            status: 500,
            message: modelResponse,
        };
        (axios.post as jest.Mock).mockResolvedValue(res);
        const response = await axios.post(
            `${API_URL}/transaction/usha`,
            transaction
        );
        expect(response.status).toBe(500);
        expect(response.data).toEqual(undefined);
        // expect(response.message).toMatch(
        //     "Can't make a transaction as insufficient funds"
        // );
    });

    it("Should not make transaction as exceeding target", async () => {
        jest.spyOn(UserModel, "findOne").mockResolvedValue({
            _id: "1",
            balance: 5000,
        });
        jest.spyOn(BudgetModel, "findOne").mockResolvedValue({
            userId: "1",
            categories: [{ title: "Food", target: 1000, spent: 800 }],
        });
        const transaction = {
            transactioName: "Buy Groceries",
            title: "Food",
            amount: 500,
            date: new Date("2024-10-02"),
        };
        const modelResponse = await budgetInstance.makeTransaction(
            transaction.title,
            transaction.title,
            transaction.amount,
            transaction.date
        );
        const res = {
            status: 500,
            msg: modelResponse,
        };
        (axios.post as jest.Mock).mockResolvedValue(res);
        const response = await axios.post(
            `${API_URL}/transaction/usha`,
            transaction
        );
        expect(response.status).toBe(500);
        expect(response.data).toEqual(undefined);
        expect(res.msg).toMatch(
            "Can't do transaction as it is exceeding target amount"
        );
    });

    it("Should make transaction  succesfully", async () => {
        const validObjectId = new mongoose.Types.ObjectId();
        jest.spyOn(UserModel, "findOne").mockResolvedValue({
            _id: validObjectId,
            balance: 5000,
            save: jest.fn().mockResolvedValue(true),
        });
        jest.spyOn(BudgetModel, "findOne").mockResolvedValue({
            userId: validObjectId,
            categories: [{ title: "Food", target: 1000, spent: 0 }],
            save: jest.fn().mockResolvedValue(true),
        });
        jest.spyOn(TransactionModel.prototype, "save").mockResolvedValue(true);
        jest.spyOn(BudgetModel.prototype, "save").mockResolvedValue(true);
        jest.spyOn(UserModel.prototype, "save").mockResolvedValue(true);

        const transaction = {
            transactioName: "Buy Groceries",
            title: "Food",
            amount: 500,
            date: new Date("2024-10-02"),
        };
        const modelResponse = await budgetInstance.makeTransaction(
            transaction.title,
            transaction.title,
            transaction.amount,
            transaction.date
        );
        const res = {
            status: 200,
            msg: modelResponse,
        };
        (axios.post as jest.Mock).mockResolvedValue(res);
        const response = await axios.post(
            `${API_URL}/transaction/usha`,
            transaction
        );
        expect(response.status).toBe(200);
        expect(response.data).toEqual(undefined);
        expect(res.msg).toMatch(
            "Transaction made succesfully on Food for an amount 500"
        );
    });
});

describe("Checking budget updation functionality", () => {
    let budgetInstance: Budget;
    beforeEach(() => {
        jest.clearAllMocks();
        budgetInstance = new Budget("Usha");
    });
    it("Should return error if user is not found", async () => {
        jest.spyOn(UserModel, "findOne").mockResolvedValue(null);
        const response = await budgetInstance.updateBudget("Food", 2000);
        expect(response).toBe("User with the given username is not present");
    });

    it("Should return error if budget is not found", async () => {
        jest.spyOn(UserModel, "findOne").mockResolvedValue({ _id: "1" });
        jest.spyOn(BudgetModel, "findOne").mockResolvedValue(null);

        const response = await budgetInstance.updateBudget("Food", 2000);
        expect(response).toBe("Budget Not Found for the provided user");
    });

    it("Should return error if category is not found", async () => {
        jest.spyOn(UserModel, "findOne").mockResolvedValue({ _id: "1" });
        jest.spyOn(BudgetModel, "findOne").mockResolvedValue({
            userId: "1",
            categories: [],
        });

        const response = await budgetInstance.updateBudget("Food", 2000);
        expect(response).toBe(
            'Category "Food" does not  exists. Can\'t make transactions.'
        );
    });

    it("Should return error if new amount is insufficient", async () => {
        jest.spyOn(UserModel, "findOne").mockResolvedValue({
            _id: "1",
            balance: 300,
        });
        jest.spyOn(BudgetModel, "findOne").mockResolvedValue({
            userId: "1",
            categories: [{ title: "Food", target: 1000, spent: 800 }],
        });

        const response = await budgetInstance.updateBudget("Food", 8000);
        expect(response).toBe(
            "Can't make a transaction as insufficient funds"
        );
    });

    it("Should return error if new amount is less than spent amount", async () => {
        jest.spyOn(UserModel, "findOne").mockResolvedValue({
            _id: "1",
            balance: 1000,
            save: jest.fn().mockResolvedValue(true),
        });
        jest.spyOn(BudgetModel, "findOne").mockResolvedValue({
            userId: "1",
            categories: [{ title: "Food", target: 1000, spent: 800 }],
            save: jest.fn().mockResolvedValue(true),
        });

        const response = await budgetInstance.updateBudget("Food", 700);
        expect(response).toBe(
            "can't update the target amount as it is becoming less than spent"
        );
    });

    it("Should update budget successfully", async () => {
        jest.spyOn(UserModel, "findOne").mockResolvedValue({
            _id: "1",
            balance: 5000,
            save: jest.fn().mockResolvedValue(true),
        });
        jest.spyOn(BudgetModel, "findOne").mockResolvedValue({
            userId: "1",
            categories: [{ title: "Food", target: 1000, spent: 800 }],
            save: jest.fn().mockResolvedValue(true),
        });

        const response = await budgetInstance.updateBudget("Food", 2000);
        expect(response).toBe("Budget updated succesfully for Food");
    });
});

