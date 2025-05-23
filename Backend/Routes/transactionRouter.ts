import express from "express";
import { Transaction } from "../Classes/Transactions";
import { processCSV } from "../Utils/utils";
import { TransactionModel } from "../Collections/Transactions";
import { UserModel } from "../Collections/User";

export const TransactionRouter = express.Router();

TransactionRouter.post('/transaction/:username',async(req,res)=>{
    const {transactionName,category,amount,on,date} = req.body;
    try { 
        console.log(req.body)
        const transaction = new Transaction(transactionName,category,parseInt(amount),on,req.params.username,date);
        const result = await transaction.doTransaction();
        res.send(result);
    } catch (error:any) {
        throw new Error('Error making transaction: ' + error.message);
    }
})


TransactionRouter.post('/maketransactions',async(req,res)=>{
    try{
        const result = await processCSV();
        res.send(result);
    }
    catch(e:any){
        throw new Error(`Error occured while adding Transactions ${e.message}`)
    }
})


TransactionRouter.get('/getTransactions/:username',async(req,res)=>{
    try{
        const user = await UserModel.findOne({name:req.params.username});
        if(!user){
            res.send("No user found");
            return ''
        }
        const transactions = await TransactionModel.find({userId:user._id}).sort({ date: -1 }).limit(5);
        if(!transactions){
            res.send("No transactions found")
        }
        res.send(transactions);
    }
    catch(e:any){
        throw new Error("Error occured"+e.message);
    }
})