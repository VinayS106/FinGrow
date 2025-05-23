import { UserModel } from "../Collections/User";

export class User {
    name:string;
    password:string;
    totalIncome:number;
    balance:number;

    constructor(name:string, password:string, totalIncome:number, balance:number){
        this.name = name;
        this.password = password;
        this.totalIncome = totalIncome;
        this.balance = balance;
    }

    async create(){
        const user = new UserModel({
            name:this.name,
            password:this.password,
            totalIncome:this.totalIncome,
            balance:this.balance
        })
        await user.save();
        return "User Created Succesfully"
    }

}