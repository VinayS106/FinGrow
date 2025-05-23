import { BudgetModel } from "../Collections/Budget";
import { UserModel } from "../Collections/User";
import { TransactionModel } from "../Collections/Transactions";

export class Budget{
    username:string

    constructor(username:string,){
        this.username = username
    }

    async createBudget(title:string,target:number){
        const user = await UserModel.findOne({name:this.username});
        if (!user) {
            return "User with the given username is not present";
        }
        let budget = await BudgetModel.findOne({userId:user._id})
        if(!budget){
            budget = new BudgetModel({
                userId:user._id,
                categories:[],
            })
        }

        const categoryExists = budget.categories.some(
            (category) => category.title === title
        );
        if (categoryExists) {
            return `Category "${title}" already exists. Can't add.`;
        }
        if(target>user.balance){
            return "Total amount in account is not sufficient to add budget";
        }

        budget.categories.push({
            "title":title,
            "target":target,
            "spent":0,
        })
        await budget.save();
        user.balance -= target;
        await user.save();
        return `Added budget ${title} successfully`
    }

    async makeTransaction(transactionName:string,title:string, amount:number, date:Date){
        const user = await UserModel.findOne({name:this.username});
        if (!user) {
            return "User with the given username is not present";
        }
        let budget = await BudgetModel.findOne({userId:user._id})
        console.log(budget)
        if(!budget){
            return "Budget Not Found for the provided user";
        }
        const index = budget.categories.findIndex(
            (category) => category.title === title
        );
        if (index===-1) {
            return `Category "${title}" does not  exists. Can't make transactions.`;
        }
        if(amount>user.balance){
            return `Can't make a transaction as insufficient funds`;
        }
        if(amount+budget.categories[index].spent>budget.categories[index].target){
            return `Can't do transaction as it is exceeding target amount`;
        }
        
        const transaction = await TransactionModel.create({
            transactionName:transactionName,
            title: title,
            amount: amount,
            on:"budget",
            date: date,
            type:"debit",
            userId:user._id
        });
        await transaction.save();
        console.log("Transaction saved")
        budget.categories[index].spent += amount;
        user.balance -= amount;

        await budget.save();
        await user.save();

        return `Transaction made succesfully on ${title} for an amount ${amount}`
    }

    async updateBudget(title:string, amount:number,){
        const user = await UserModel.findOne({name:this.username})
        if (!user) {
            return "User with the given username is not present";
        }
        let budget = await BudgetModel.findOne({userId:user._id})
        if(!budget){
            return "Budget Not Found for the provided user";
        }
        const index = budget.categories.findIndex(
            (category) => category.title === title
        );
        if (index===-1) {
            return `Category "${title}" does not  exists. Can't make transactions.`;
        }
        if(amount>user.balance){
            return `Can't make a transaction as insufficient funds`;
        }
        if(amount < budget.categories[index].spent){
            return "can't update the target amount as it is becoming less than spent"
        }
        budget.categories[index].target = amount;
        await budget.save();

        return `Budget updated succesfully for ${title}`;
    }
}