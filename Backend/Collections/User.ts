import { Schema } from "mongoose";
import { config } from "../Config/Config";

interface IUser extends Document {
    username: string;
    password: string;
    totalIncome: number;
    balance:number;
}

const userSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    totalIncome:{
        type:Number,
        required:true,
    },
    balance:{
        type:Number,
        required:true,
        default:0
    }
})

export const UserModel = config.model<IUser>("users",userSchema);
console.log("User Model Created");

