import axios from 'axios'
const API_URL = `http://localhost:5050/api`;
jest.mock("axios");

import { Savings } from '../Classes/Savings';
import { SavingsModel } from '../Collections/Savings';
import { TransactionModel } from "../Collections/Transactions";
import { UserModel } from "../Collections/User";
import mongoose from 'mongoose';

describe("Checking Saving Goal creation functionality",()=>{
    let savingsInstance:Savings;
    beforeEach(() => {
        jest.clearAllMocks();
        savingsInstance = new Savings("Usha")
    });
    it('Should not create saving if user is not present',async()=>{
        jest.spyOn(UserModel, "findOne").mockResolvedValue(null);
        const Modelresponse = await savingsInstance.createSaving("Vacation", 2000);
        const res = {
            status: 400,
            msg: "User with the given username is not present",
        };
        (axios.post as jest.Mock).mockResolvedValue(res);

        const saving = {
            title:"Vacation",
            target:2000
        };
        const response = await axios.post(`${API_URL}/savings/mammu`, saving);
        expect(response.status).toBe(400);
        expect(response.data).toEqual(undefined);
        expect(res.msg).toMatch("User with the given username is not present");
    });

    it("Should create new saving if no existing saving is found", async () => {
        jest.spyOn(UserModel, "findOne").mockResolvedValue({
            _id: "1",
            name: "Usha",
            password: "1234",
            totalIncome: 2000,
            balance: 3000,
        });
        jest.spyOn(SavingsModel, "findOne").mockResolvedValue(null);
        jest.spyOn(SavingsModel.prototype, "save").mockResolvedValue(true);

        const response = await savingsInstance.createSaving("Vacation", 2000);
        expect(response).toBe("Added saving goal Vacation successfully.");
    });

    it('Should not add goal as it exists',async()=>{
        jest.spyOn(UserModel, "findOne").mockResolvedValue({
            _id: "1",
            name: "Usha",
            password: "1234",
            totalIncome: 2000,
            balance: 3000,
        });
        jest.spyOn(SavingsModel, "findOne").mockResolvedValue({
            userId: "1",
            savings: [{ title: "Vacation", target: 2000, current: 0 }],
            save: jest.fn().mockResolvedValue(true),
        });

        const goal = {
            title:"Vacation",
            target:2000
        };
        const Modelresponse = await savingsInstance.createSaving(goal.title,goal.target);
        const res = {
            status: 500,
            msg: Modelresponse,
        };
        (axios.post as jest.Mock).mockResolvedValue(res);

        const response = await axios.post(`${API_URL}/savings/usha`, goal);
        expect(response.status).toBe(500);
        expect(response.data).toEqual(undefined);
        expect(res.msg).toMatch("Savings Vacation already exists. Can't add.");
    });

    it('Should not add goal as it exceeds total left balance',async()=>{
        jest.spyOn(UserModel, "findOne").mockResolvedValue({
            _id: "1",
            name: "Usha",
            password: "1234",
            totalIncome: 2000,
            balance: 1000,
        });
        jest.spyOn(SavingsModel, "findOne").mockResolvedValue({
            userId: "1",
            savings: [],
            save: jest.fn().mockResolvedValue(true),
        });

        const goal = {
            title:"Vacation",
            target:2000
        };
        const Modelresponse = await savingsInstance.createSaving(goal.title,goal.target);
        const res = {
            status: 500,
            msg: Modelresponse,
        };
        (axios.post as jest.Mock).mockResolvedValue(res);

        const response = await axios.post(`${API_URL}/savings/usha`, goal);
        expect(response.status).toBe(500);
        expect(response.data).toEqual(undefined);
        expect(res.msg).toMatch("Total amount in account is not sufficient to add goal");
    });

    it('Should add goal successfully',async()=>{
        const res = {
            status: 200,
            data:{
                "title":"Self",
                "target":2000,
                "spent":0,
                "transactions":[]
            },
            msg: "Added Self successfully",
        };
        (axios.post as jest.Mock).mockResolvedValue(res);

        const goal = {
            title:"Groceries",
            target:2000
        };
        const response = await axios.post(`${API_URL}/savings/usha`, goal);
        expect(response.status).toBe(200);
        expect(response.data).toEqual({
            "title":"Self",
            "target":2000,
            "spent":0,
            "transactions":[]
        });
        expect(res.msg).toMatch("Added Self successfully");
    });

    it("Should not add saving goal as server issue", async () => {
        const errorMessage = "Something went wrong";
        (axios.post as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const goal = {
            title:"Groceries",
            target:2000
        };

        try{
            const response = await axios.post(`${API_URL}/savings/usha`, goal);
        }
        catch(error:any){
            expect(error.message).toBe("Something went wrong");
        }
    });
})


describe('Checking saving transaction functionality',()=>{
    let savingsInstance:Savings;
    beforeEach(() => {
        jest.clearAllMocks();
        savingsInstance = new Savings("Usha")
    });
    it('Should not make transaction as user is not present',async()=>{
        jest.spyOn(UserModel, "findOne").mockResolvedValue(null);
        const transaction = {
            transactioName: "Saving",
            title: "Vacation",
            amount: 500,
            date: new Date("2024-10-02"),
        };
        const modelresponse = await savingsInstance.makeTransaction(
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
        const response = await axios.post(`${API_URL}/transaction/mammu`, transaction);
        expect(response.status).toBe(404);
        expect(response.data).toEqual(undefined);
        expect(res.msg).toMatch("User with the given username is not present");
    });

    it("Should return error if budget is not found", async () => {
        jest.spyOn(UserModel, "findOne").mockResolvedValue({ _id: "1" });
        jest.spyOn(SavingsModel, "findOne").mockResolvedValue(null);

        const transaction = {
            transactioName: "Saving",
            title: "Vacation",
            amount: 500,
            date: new Date("2024-10-02"),
        };
        const modelResponse = await savingsInstance.makeTransaction(
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
        expect(res.message).toBe("Saving Not Found for the provided user");
    });

    it('Should not make transaction as saving is not present',async()=>{
        jest.spyOn(UserModel, "findOne").mockResolvedValue({ _id: "1" });
        jest.spyOn(SavingsModel, "findOne").mockResolvedValue({
            userId: "1",
            savings: [],
        });
        const transaction = {
            transactioName: "saving",
            title: "Emergency",
            amount: 500,
            date: new Date("2024-10-02"),
        };
        const modelResponse = await savingsInstance.makeTransaction(
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
        const response = await axios.post(`${API_URL}/transaction/usha`, transaction);
        expect(response.status).toBe(500);
        expect(response.data).toEqual(undefined);
        expect(res.message).toMatch("Saving \"Emergency\" does not  exists. Can't make transactions.");
    });

    it('Should not make transaction as insufficient funds',async()=>{
        jest.spyOn(UserModel, "findOne").mockResolvedValue({
            _id: "1",
            balance: 300,
        });
        jest.spyOn(SavingsModel, "findOne").mockResolvedValue({
            userId: "1",
            savings: [{ title: "Self-Saving", target: 1000, current: 0 }],
        });
        const transaction = {
            transactioName: "Self",
            title: "Self-Saving",
            amount: 500,
            date: new Date("2024-10-02"),
        };
        const modelResponse = await savingsInstance.makeTransaction(
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

        const response = await axios.post(`${API_URL}/transaction/usha`, transaction);
        expect(response.status).toBe(500);
        expect(response.data).toEqual(undefined);
        expect(res.message).toMatch("Can't make a transaction as insufficient funds");
    });

    it("Should not make transaction as exceeding target", async () => {
        jest.spyOn(UserModel, "findOne").mockResolvedValue({
            _id: "1",
            balance: 5000,
        });
        jest.spyOn(SavingsModel, "findOne").mockResolvedValue({
            userId: "1",
            savings: [{ title: "vacation", target: 1000, current: 800 }],
        });
        const transaction = {
            transactioName: "Buy Groceries",
            title: "vacation",
            amount: 500,
            date: new Date("2024-10-02"),
        };
        const modelResponse = await savingsInstance.makeTransaction(
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
    it('Should make transaction  succesfully',async()=>{
        const validObjectId = new mongoose.Types.ObjectId();
        jest.spyOn(UserModel, "findOne").mockResolvedValue({
            _id: validObjectId,
            balance: 5000,
            save: jest.fn().mockResolvedValue(true),
        });
        jest.spyOn(SavingsModel, "findOne").mockResolvedValue({
            userId: validObjectId,
            savings: [{ title: "vacation", target: 1000, current: 0 }],
            save: jest.fn().mockResolvedValue(true),
        });
        jest.spyOn(TransactionModel.prototype, "save").mockResolvedValue(true);
        jest.spyOn(SavingsModel.prototype, "save").mockResolvedValue(true);
        jest.spyOn(UserModel.prototype, "save").mockResolvedValue(true);

        const transaction = {
            transactioName: "vacation saving",
            title: "vacation",
            amount: 500,
            date: new Date("2024-10-02"),
        };
        const modelResponse = await savingsInstance.makeTransaction(
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
        const response = await axios.post(`${API_URL}/transaction/usha`, transaction);
        expect(response.status).toBe(200);
        expect(res.msg).toMatch("Transaction made succesfully on vacation for an amount 500");
    });

    it('Should make transaction  succesfully',async()=>{
        const validObjectId = new mongoose.Types.ObjectId();
        jest.spyOn(UserModel, "findOne").mockResolvedValue({
            _id: validObjectId,
            balance: 5000,
            save: jest.fn().mockResolvedValue(true),
        });
        jest.spyOn(SavingsModel, "findOne").mockResolvedValue({
            userId: validObjectId,
            savings: [{ title: "vacation", target: 1000, current: 0 }],
            save: jest.fn().mockResolvedValue(true),
        });
        jest.spyOn(TransactionModel.prototype, "save").mockResolvedValue(true);
        jest.spyOn(SavingsModel.prototype, "save").mockResolvedValue(true);
        jest.spyOn(UserModel.prototype, "save").mockResolvedValue(true);

        const transaction = {
            transactioName: "vacation saving",
            title: "vacation",
            amount: 990,
            date: new Date("2024-10-02"),
        };
        const modelResponse = await savingsInstance.makeTransaction(
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
        const response = await axios.post(`${API_URL}/transaction/usha`, transaction);
        expect(response.status).toBe(200);
        expect(res.msg).toMatch("Transaction made succesfully on vacation for an amount 990. Also, Congratulations as you have saved 90% of the target anount");
    });
    
})

describe("Checking budget updation functionality", () => {
    let savingsInstance: Savings;
    beforeEach(() => {
        jest.clearAllMocks();
        savingsInstance = new Savings("Usha");
    });
    it("Should return error if user is not found", async () => {
        jest.spyOn(UserModel, "findOne").mockResolvedValue(null);
        const response = await savingsInstance.updateSavings("Vacation", 2000);
        expect(response).toBe("User with the given username is not present");
    });

    it("Should return error if saving is not found", async () => {
        jest.spyOn(UserModel, "findOne").mockResolvedValue({ _id: "1" });
        jest.spyOn(SavingsModel, "findOne").mockResolvedValue(null);

        const response = await savingsInstance.updateSavings("Vacation", 2000);
        expect(response).toBe("Saving Not Found for the provided user");
    });

    it("Should return error if goal is not found", async () => {
        jest.spyOn(UserModel, "findOne").mockResolvedValue({ _id: "1" });
        jest.spyOn(SavingsModel, "findOne").mockResolvedValue({
            userId: "1",
            savings: [],
        });

        const response = await savingsInstance.updateSavings("Vacation", 2000);
        expect(response).toBe(
            'Saving "Vacation" does not  exists. Can\'t make transactions.'
        );
    });

    it("Should return error if new amount is insufficient", async () => {
        jest.spyOn(UserModel, "findOne").mockResolvedValue({
            _id: "1",
            balance: 300,
        });
        jest.spyOn(SavingsModel, "findOne").mockResolvedValue({
            userId: "1",
            savings: [{ title: "Vacation", target: 1000, current: 800 }],
            save: jest.fn().mockResolvedValue(true),
        });

        const response = await savingsInstance.updateSavings("Vacation", 8000);
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
        jest.spyOn(SavingsModel, "findOne").mockResolvedValue({
            userId: "1",
            savings: [{ title: "Vacation", target: 1000, current: 800 }],
            save: jest.fn().mockResolvedValue(true),
        });

        const response = await savingsInstance.updateSavings("Vacation", 700);
        expect(response).toBe(
            "Can't update the target amount as it is becoming less than current saved"
        );
    });

    it("Should update budget successfully", async () => {
        jest.spyOn(UserModel, "findOne").mockResolvedValue({
            _id: "1",
            balance: 5000,
            save: jest.fn().mockResolvedValue(true),
        });
        jest.spyOn(SavingsModel, "findOne").mockResolvedValue({
            userId: "1",
            savings: [{ title: "Food", target: 1000, spent: 800 }],
            save: jest.fn().mockResolvedValue(true),
        });

        const response = await savingsInstance.updateSavings("Food", 2000);
        expect(response).toBe("Savings Target updated succesfully for Food");
    });
});