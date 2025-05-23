import axios from "axios";
const API_URL = `http://localhost:5050/api`;
jest.mock("axios");

import { Report } from '../Classes/Report';
import { UserModel } from '../Collections/User';
import { TransactionModel } from '../Collections/Transactions';
import { BudgetModel } from "../Collections/Budget";
import { SavingsModel } from "../Collections/Savings";

jest.mock('../Collections/User', () => ({
    UserModel: {
        findOne: jest.fn(),
    },
}));

jest.mock('../Collections/Transactions', () => ({
    TransactionModel: {
        find: jest.fn(),
    },
}));
jest.mock('../Collections/Budget', () => ({
    BudgetModel: {
        findOne: jest.fn(),
    },
}));
jest.mock('../Collections/Savings', () => ({
    SavingsModel: {
        findOne: jest.fn(),
    },
}));


describe('Report Class Tests with Mocking', () => {
    let report: Report;

    beforeEach(() => {
        report = new Report('usha');
        jest.clearAllMocks();  
    });

    test('should return total income and expenses', async () => {
        (UserModel.findOne as jest.Mock).mockResolvedValue({
            _id: '12345',
            name: 'usha',
        });
        (TransactionModel.find as jest.Mock).mockResolvedValue([
            { type: 'credit', amount: 100, date: new Date('2024-10-10') },
            { type: 'debit', amount: 50, date: new Date('2024-10-12') },
        ]);

        const result = await report.totalIncomeAndExpenses(new Date('2024-10-01'), new Date('2024-10-31'));

        if (typeof result !== 'string') {
            expect(result.totalIncome).toBe(100);
            expect(result.totalExpenses).toBe(50);
            expect(result.income.length).toBe(1);
            expect(result.expenses.length).toBe(1);
        }
    });

    test('should return no user found when UserModel.findOne returns null', async () => {
        (UserModel.findOne as jest.Mock).mockResolvedValue(null);
        const result = await report.totalIncomeAndExpenses(new Date('2024-10-01'), new Date('2024-10-31'));
        expect(result).toBe('No user Found with provided details');
    });

    test('should return budget usage summary', async () => {
        (UserModel.findOne as jest.Mock).mockResolvedValue({
            _id: '12345',
            name: 'usha',
        });
    
        (BudgetModel.findOne as jest.Mock).mockResolvedValue({
            categories: [
                { title: 'Food', target: 500, spent: 200 },
                { title: 'Transport', target: 300, spent: 150 },
            ],
        });
    
        const result = await report.budgetUsageSummary();
    
        expect(result).toEqual([
            { category: 'Food', target: 500, spent: 200, usagePercentage: '40.00%' },
            { category: 'Transport', target: 300, spent: 150, usagePercentage: '50.00%' },
        ]);
    });

    test('should return savings progress', async () => {
        (UserModel.findOne as jest.Mock).mockResolvedValue({
            _id: '12345',
            name: 'usha',
        });
    
        (SavingsModel.findOne as jest.Mock).mockResolvedValue({
            savings: [
                { title: 'Emergency Fund', target: 1000, current: 300 },
                { title: 'Vacation Fund', target: 500, current: 250 },
            ],
        });
    
        const result = await report.savingsProgress();
    
        expect(result).toEqual([
            { savingGoal: 'Emergency Fund', target: 1000, current: 300, progressPercentage: '30.00%' },
            { savingGoal: 'Vacation Fund', target: 500, current: 250, progressPercentage: '50.00%' },
        ]);
    });
    
    it('should return "No user Found with provided details" if no user is found', async () => {
        (UserModel.findOne as jest.Mock).mockResolvedValue(null);
    
        const result = await report.budgetUsageSummary();
        expect(result).toBe('No user Found with provided details');
      });
      it('should return "Budget not found for user" if no budget is found', async () => {
        (UserModel.findOne as jest.Mock).mockResolvedValue({ _id: 'user_id' });
        (BudgetModel.findOne as jest.Mock).mockResolvedValue(null);
    
        const result = await report.budgetUsageSummary();
        expect(result).toBe(`Budget not found for user: usha`);
      });
      it('should return "No user Found with provided details" if no user is found', async () => {
        (UserModel.findOne as jest.Mock).mockResolvedValue(null);
    
        const result = await report.savingsProgress();
        expect(result).toBe('No user Found with provided details');
      });
      it('should return "Savings not found for user" if no savings are found', async () => {
        (UserModel.findOne as jest.Mock).mockResolvedValue({ _id: 'user_id' });
        (SavingsModel.findOne as jest.Mock).mockResolvedValue(null);
    
        const result = await report.savingsProgress();
        expect(result).toBe(`Savings not found for user: usha`);
      });
    
});
