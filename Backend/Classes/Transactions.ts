import { Budget } from "./Budget";
import { Savings } from "./Savings";

export class Transaction{
    transactionName:string
    title: string;
    amount:number;
    on:string;
    date:Date;
    username:string;

    constructor(transactionName:string,title:string,amount: number,on: string,username:string, date:Date) {
        this.transactionName=transactionName
        this.title=title;
        this.amount = amount;
        this.on = on;
        this.date = date 
        this.username = username;
    }

    async doTransaction(){
        if(this.on==="budget"){
            console.log("came to budget")
            const budget = new Budget(this.username)
            const result = await budget.makeTransaction(this.transactionName,this.title, this.amount,this.date)
            console.log(result)
            return result;
        }
        else {
            const saving = new Savings(this.username)
            const result = await saving.makeTransaction(this.transactionName,this.title,this.amount,this.date)
            return result;
        }
       
    }
}

