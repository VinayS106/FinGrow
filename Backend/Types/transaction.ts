import { Schema } from "mongoose"

export type transaction = {
    amount:number;
    date:Date;
    type:string,
    category:string
}