import { BudgetModel } from "../Collections/Budget";
import { SavingsModel } from "../Collections/Savings";
import { TransactionModel } from "../Collections/Transactions";
import { UserModel } from "../Collections/User";

export class Report {
    username:string

    constructor(username:string) {
        this.username = username;
    }

    async totalIncomeAndExpenses(startDate: Date, endDate: Date) {
        const user = await UserModel.findOne({name:this.username})
        if(!user){
            return 'No user Found with provided details'
        }
        const transactions = await TransactionModel.find({
            userId: user._id,
            date: { $gte: startDate, $lte: endDate },
        });
        let totalIncome=0;
        let totalExpenses=0;
        let income:any=[]
        let expenses:any=[]
        transactions.map(
            (transaction) => {
                if (transaction.type === 'credit') {
                    totalIncome += transaction.amount;
                    income.push(transaction)
                }  else{
                    totalExpenses += transaction.amount;
                    expenses.push(transaction)
                }
            },
        );
        const report={
            "totalIncome":totalIncome,
            "totalExpenses":totalExpenses,
            "income":income,
            "expenses":expenses
        }
        console.log(report)
        return report;
    }

    async budgetUsageSummary() {
        const user = await UserModel.findOne({name:this.username})
        if(!user){
            return 'No user Found with provided details'
        }
        const budget = await BudgetModel.findOne({ userId: user._id });

        if (!budget) {
            return `Budget not found for user: ${this.username}`;
        }

        const summary = budget.categories.map((category) => {
            const usagePercentage = ((category.spent / category.target) * 100).toFixed(2);
            return {
                category: category.title,
                target: category.target,
                spent: category.spent,
                usagePercentage: `${usagePercentage}%`,
            };
        });
        console.log("summary", summary)
        return summary;
    }


    async savingsProgress() {
        const user = await UserModel.findOne({name:this.username})
        if(!user){
            return 'No user Found with provided details'
        }
        const savings = await SavingsModel.findOne({ userId: user._id });

        if (!savings) {
            return(`Savings not found for user: ${this.username}`);
        }

        const progress = savings.savings.map((saving) => {
            const progressPercentage = ((saving.current / saving.target) * 100).toFixed(2);
            return {
                savingGoal: saving.title,
                target: saving.target,
                current: saving.current,
                progressPercentage: `${progressPercentage}%`,
            };
        });
        console.log("progress",progress)

        return progress;
    }
}