import { Schema, Types} from "mongoose";
import { config } from "../Config/Config";

interface IBudget extends Document{
    userId: Schema.Types.ObjectId,
    categories:Array<{"title":string,"target":number,"spent":number,}>
}

const budgetSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    categories: [
        {
            title: {
                type: String,
                required: true,
            },
            target: {
                type: Number,
                required: true,
            },
            spent: {
                type: Number,
                required: true,
            },
        },
    ],
});

export const BudgetModel = config.model<IBudget>("budget", budgetSchema);
console.log("Budget Model created");
