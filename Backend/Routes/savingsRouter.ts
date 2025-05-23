import express from 'express'
import { Savings } from '../Classes/Savings';
export const savingsRouter = express.Router();

savingsRouter.post('/savings/:username',async(req,res)=>{
    try {
        const saving = new Savings(req.params.username);
        const {title, target } = req.body;
        if (!title || !target) {
            res.status(400).send("Form Incomplete");
            return;
        }
        const result = await saving.createSaving(title, target);
        if (result === `Added saving goal ${title} successfully.`) {
            res.status(200).send(result);
        } else {
            res.status(500).send(`Error adding savings`);
            return;
        }
    } catch (error:any) {
       throw new Error('Error creating saving: ' + error.message);
    }
})

