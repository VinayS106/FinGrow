import axios from "axios";
import { UserModel } from "../Collections/User";
import { User } from "../Classes/User";
import mongoose from "mongoose";
const API_URL = `http://localhost:5050/api`;
jest.mock("axios");

describe("Checking post request of user", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a user successfully', async () => {
        const saveMock = jest.spyOn(UserModel.prototype, 'save').mockResolvedValue('User Created Succesfully');
        const user = new User('Usha', '1234', 10000, 10000); 
        const result = await user.create();
        expect(saveMock).toHaveBeenCalled();
        expect(result).toBe('User Created Succesfully');
    });

    it("Should succesfully create a user and returm success message", async () => {
        const res = {
            status: 200,
            data: {
                name: "Usha",
                password: "1234",
                totalIncome: 10000,
                balance: 10000,
            },
            msg: "User Created Succesfully",
        };
        (axios.post as jest.Mock).mockResolvedValue(res);

        const user = {
            name: "",
            password: "",
            totalIncome: 10000,
            balance: 10000,
        };
        const response = await axios.post(`${API_URL}/users`, user);
        expect(response.status).toBe(200);
        expect(response.data).toEqual({
            name: "Usha",
            password: "1234",
            totalIncome: 10000,
            balance: 10000,
        });
        expect(res.msg).toMatch("User Created Succesfully");
    });

    it("Should not create user as information is not provided", async () => {
        const res = {
            status: 400,
            msg: "Error creating user",
        };
        (axios.post as jest.Mock).mockRejectedValue(res);
        const user = {
            name: "",
            password: "",
            totalIncome: 10000,
            balance: 10000,
        };
        try {
            await axios.post(`${API_URL}/users`, user);
        } catch (error: any) {
            expect(error.status).toBe(400);
            expect(error.data).toEqual(undefined);
            expect(res.msg).toMatch("Error creating user");
        }
    });
});
