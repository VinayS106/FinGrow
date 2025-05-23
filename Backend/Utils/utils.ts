import * as fs from 'fs';
import csv from 'csv-parser';
import { Transaction } from '../Classes/Transactions';

interface ITransaction {
    transactionName:string,
    title: string;
    amount: number;
    on: string; 
    username: string;
    date: Date;        
    
}

export const readCSVFile  = async <T>(filepath:string): Promise<T[]> => {
    return new Promise((resolve,reject) => {
        const results:T[] = [];
        const stream = fs.createReadStream(filepath)
        stream.pipe(csv()).on('data',(data:any)=>results.push(data))
                          .on('end',()=>resolve(results))
                          .on('error',(error:string)=>reject(error))
         })       
}

export const processCSV=async()=>{
    try{
        const file = 'Backend/transactions.csv'
        const data = await readCSVFile<ITransaction>(file);
        const processedData = data.map((transaction) => ({
            ...transaction,
            amount: Number(transaction.amount), 
            date: new Date(transaction.date)     
        }));
        for(const item of processedData){
            console.log(item)
            const T = new Transaction(item.transactionName,item.title,item.amount,item.on,item.username,item.date)
            const result = await T.doTransaction();
            console.log(result)
        }
        return "Added all transactions"
    }
    catch(e:any){
        return  `Error occured: ${e.message}`
    }
}
