import { Schema } from "mongoose";
import { config } from "../Config/Config";

interface ITransaction extends Document {
    transactionName:string
    title:string
    amount: number;
    type: string;
    on: string;
    date: Date;
    userId: string;
}

const transactionSchema = new Schema({
    transactionName:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    on: {
        type: String,
        required: true,
    },
    userId: { 
        type: Schema.Types.ObjectId,
        ref:'users', 
        required: true 
    },
});

export const TransactionModel = config.model<ITransaction>(
    "transactions",
    transactionSchema
);
console.log("Transaction Model created");
