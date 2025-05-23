import express from 'express'
import { User } from '../Classes/User';
import { UserModel } from '../Collections/User';
export const userRouter = express.Router();

userRouter.post('/users',async(req,res)=>{
    try{
        const { name, password, totalIncome, balance } = req.body;
        const user = new User(name, password, totalIncome, balance);
        const result = await user.create();
        if (result === "User Created Succesfully") {
            res.status(200).send(result);
            return;
        } else {
            res.status(500).json({ message: "Error creating user" });
            return;
        }
    }
    catch(error:any){   
        throw new Error('Error creating user: ' + error.message);
    }   
})


userRouter.post('/users/:username',async(req,res)=>{
    try{
        const username = req.params.username;
        const password = req.body.password;
        const user= await UserModel.findOne({name:username});
        if(!user){
            res.status(404).send("User not found");
            return;
        }
        if(user && user.password===password){
            res.status(200).send(user);
            return;
        }
        else{
            res.status(401).send("Invalid Credentials: UnAuthorised")
            return;
        }
    }
    catch(e){
        res.status(500).send("Something went wrong");
        return;
    }
})