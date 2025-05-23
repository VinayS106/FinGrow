import fs from 'fs';
import csv from 'csv-parser';
import { Transaction } from '../Classes/Transactions';
import { readCSVFile, processCSV } from './../Utils/utils'; // Adjust the path to your actual code file

jest.mock('fs');
jest.mock('csv-parser');

const FILE_PATH = 'transaction.csv';
const MOCK_DATA = [
    { transactionName: 'Test Transaction 1', title: 'Test 1', amount: '100', on: 'budget', username: 'user1', date: '2024-10-18' },
    { transactionName: 'Test Transaction 2', title: 'Test 2', amount: '200', on: 'saving', username: 'user2', date: '2024-10-19' }
];

describe('CSV File Processing', () => {
    let mockStream: any;

    beforeEach(() => {
        jest.clearAllMocks();
        mockStream = {
            pipe: jest.fn().mockReturnThis(),
            on: jest.fn().mockImplementation((event, callback) => {
                if (event === 'data') {
                    MOCK_DATA.forEach(callback); 
                }
                if (event === 'end') {
                    callback();
                }
                if (event === 'error') {
                    callback(new Error('Stream error')); 
                }
                return mockStream;
            }),
        };

        (fs.createReadStream as jest.Mock).mockReturnValue(mockStream);
        (csv as jest.Mock).mockReturnValue(mockStream); 
    });

    test('should read CSV file and return data as array', async () => {
        const result = await readCSVFile(FILE_PATH);
        expect(result).toEqual(MOCK_DATA);
        expect(fs.createReadStream).toHaveBeenCalledWith(FILE_PATH);
    });

    test('should process CSV file and perform transactions', async () => {
        const mockTransaction = jest.spyOn(Transaction.prototype, 'doTransaction').mockResolvedValue('Transaction Done');

        const result = await processCSV();
        expect(result).toBe('Added all transactions');
        expect(mockTransaction).toHaveBeenCalledTimes(2); 
    });

    test('should return an error message if CSV processing fails', async () => {
        mockStream.on = jest.fn().mockImplementation((event, callback) => {
            if (event === 'error') {
                callback(new Error('Failed to process CSV'));
            }
            return mockStream;
        });

        const result = await processCSV().catch((e) => e.message);
        expect(result).toBe('Error occured: Failed to process CSV');
    });
});
