import mongoose from "mongoose";
jest.mock("mongoose");

describe("MongoDB Connection", () => {
    beforeAll(() => {
        console.log = jest.fn();
    });
    it("should connect successfully", () => {
        (mongoose.createConnection as jest.Mock).mockReturnValue({
            readyState: 1, 
        });
        const { config } = require("./../Config/Config");

        expect(mongoose.createConnection).toHaveBeenCalledWith("mongodb://localhost/fingrowDB");
        expect(config.readyState).toBe(1); 
        expect(console.log).toHaveBeenCalledWith("Connected");
    });

    it("should fail to connect and throw an error", () => {
        const errorMessage = "Database connection failed";
        (mongoose.createConnection as jest.Mock).mockImplementation(() => {
            throw new Error(errorMessage);
        });
        try {
            const { connectToDatabase } = require("./../Config/Config");
            connectToDatabase();  
        } catch (error: any) {
            expect(error.message).toBe("Database connection failed: " + errorMessage);
        }
    });

})
