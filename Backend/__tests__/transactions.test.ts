import axios from 'axios'
const API_URL = `http://localhost:5050/api`;
import { Budget } from '../Classes/Budget';
import { Transaction } from '../Classes/Transactions';
import { Savings } from '../Classes/Savings';

jest.mock('axios');
jest.mock('../Classes/Budget', () => {
    return {
        Budget: jest.fn().mockImplementation(() => ({
            makeTransaction: jest.fn().mockResolvedValue('Succesfully transaction made')
        })),
    };
});
jest.mock('../Classes/Savings', () => {
    return {
        Savings: jest.fn().mockImplementation(() => ({
            makeTransaction: jest.fn().mockResolvedValue('Succesfully transaction made')
        })),
    };
});

describe("Checking transaction functionality",()=>{
   
    let transaction: Transaction;
    let budgetMock: any;
    let savingsMock:any;
    const mockUser = {
        _id: '12345',
        name: 'usha',
        totalIncome: 1000,
        balance: 1000,
        save: jest.fn(),
    };

    beforeEach(()=>{
        jest.clearAllMocks();
        transaction = new Transaction('Pay Bills', 'Electricity', 100, 'budget', 'usha',new Date("10-12-2024"));
        budgetMock = new Budget("usha")
        savingsMock = new Savings("usha")
    })

    test('should call makeTransaction when on is "budget"', async () => {
        budgetMock.makeTransaction.mockResolvedValue('Succesfully transaction made');
        const result = await transaction.doTransaction();
        expect(result).toBe('Succesfully transaction made');
    });

    test('should call makeTransaction when on is "savings"', async () => {
        savingsMock.makeTransaction.mockResolvedValue('Succesfully transaction made');
        transaction = new Transaction('Pay Bills', 'Electricity', 100, 'saving', 'usha',new Date("10-12-2024"));
        const result = await transaction.doTransaction();
        expect(result).toBe('Succesfully transaction made');
    });

    it('Should not do transaction as user is not present',async()=>{
        const res = {
            status: 404,
            msg: "No user found",
        };
        (axios.post as jest.Mock).mockResolvedValue(res);

        const transaction = {
            title:"Food",
            amount:500,
            on:"others",
            date:new Date("2024-10-02"),
            type:"credit",
        };
        const response = await axios.post(`${API_URL}/transaction/usha`, transaction);
        expect(response.status).toBe(404);
        expect(response.data).toEqual(undefined);
        expect(res.msg).toMatch('No user found')
    })

    it('Should  do transaction',async()=>{
        const res = {
            status: 200,
            msg: "Succesfully transaction made",
        };
        (axios.post as jest.Mock).mockResolvedValue(res);

        const transaction = {
            title:"Food",
            amount:500,
            on:"others",
            date:new Date("2024-10-02"),
            type:"credit",
        };
        const response = await axios.post(`${API_URL}/transaction/usha`, transaction);
        expect(response.status).toBe(200);
        expect(response.data).toEqual(undefined);
        expect(res.msg).toMatch("Succesfully transaction made")
    })

    it('Should not do transaction as server issue',async()=>{
        const errorMessage = "Something went wrong";
        (axios.post as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const transaction = {
            title:"Food",
            amount:500,
            on:"others",
            date:new Date("2024-10-02"),
            type:"credit",
        };
        try{
            await axios.post(`${API_URL}/transaction/usha`, transaction);
        }
        catch(e:any){
            expect(e.message).toMatch("Something went wrong")
        }
    });
})
