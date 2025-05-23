import React from "react";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import BudgetSavingForm from "../Forms/BudgetSavingForm";
import { UserContext } from "../Context";
import { MemoryRouter } from "react-router-dom";
import { API_URL } from "../API";

global.fetch = jest.fn();

describe("Checking Budget Form Component", () => {
    const mockSetUser = jest.fn();
    const renderComponent = (type:string,user?:any) => {
        render(
            <UserContext.Provider
                value={{
                    user: user ? user : null,
                    setUser: mockSetUser,
                    transactions: [],
                    setTransactions: jest.fn(),
                }}
            >
                <MemoryRouter>
                    <BudgetSavingForm type={type} />
                </MemoryRouter>
            </UserContext.Provider>
        );
    };

    beforeEach(() => {
        jest.resetAllMocks();
        window.alert = jest.fn();
    });

    it("should render no user present if no user",()=>{
        renderComponent("budget");
        expect(screen.getByText("NO user")).toBeInTheDocument()
    })
    it("should render form inputs and button", () => {
        const user = {name:"Usha",password:"1234",totalIncome:20000,balance:10000}
        renderComponent("budget",user);
        expect(screen.queryByPlaceholderText("Category")).toBeInTheDocument();
        expect(screen.queryByPlaceholderText("Amount")).toBeInTheDocument();
    });

    it("should show 'Context not present' if no context is available", () => {
        render(<BudgetSavingForm type="budget"/>)
        expect(screen.getByText("Context not present")).toBeInTheDocument();
    });


    it("Should create budget",async()=>{
        const user = {name:"Usha",password:"1234",totalIncome:20000,balance:10000}
        renderComponent("budget",user);
        (fetch as jest.Mock).mockResolvedValue({
            status:200,
            json: async () => ({ title:"Food",target:"4000"} ),
        });

        fireEvent.change(screen.getByTestId("category-input")!, {
            target: { value: "Food" },
        });
        fireEvent.change(screen.getByTestId("amount-input")!, {
            target: { value: "4000" },
        });
        

        fireEvent.click(screen.getByRole("button", { name: /Create/i }));
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(`${API_URL}/budget/Usha`, {
                method: "POST",
                body: JSON.stringify({title:"Food", target:"4000"}),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            expect(window.alert).toHaveBeenCalledWith('BUDGET created');
        });
    })

    it("Should not create budget due to incomplete form",async()=>{
        const user = {name:"Usha",password:"1234",totalIncome:20000,balance:10000}
        renderComponent("budget",user);
        (fetch as jest.Mock).mockResolvedValue({
            status:400,
            json: async () => ({ title:"Entertainment",target:""} ),
        });

        fireEvent.change(screen.getByTestId("category-input")!, {
            target: { value: "Entertainment" },
        });
        

        fireEvent.click(screen.getByRole("button", { name: /Create/i }));
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(`${API_URL}/budget/Usha`, {
                method: "POST",
                body: JSON.stringify({title:"Entertainment", target:""}),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            expect(window.alert).toHaveBeenCalledWith('Form Incomplete');
        });
    })


    it("Should not create budget as server error",async()=>{
        const user = {name:"Usha",password:"1234",totalIncome:20000,balance:10000}
        renderComponent("budget",user);
        (fetch as jest.Mock).mockResolvedValue({
            status:500,
            json: async () => ({ title:"Food",target:"4000"} ),
        });

        fireEvent.change(screen.getByTestId("category-input")!, {
            target: { value: "Food" },
        });
        fireEvent.change(screen.getByTestId("amount-input")!, {
            target: { value: "4000" },
        });
        

        fireEvent.click(screen.getByRole("button", { name: /Create/i }));
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(`${API_URL}/budget/Usha`, {
                method: "POST",
                body: JSON.stringify({title:"Food", target:"4000"}),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            expect(window.alert).toHaveBeenCalledWith('Error creating budget');
        });
    })
    it("Should not create budget as server error",async()=>{
        const user = {name:"Usha",password:"1234",totalIncome:20000,balance:10000}
        renderComponent("budget",user);
        (fetch as jest.Mock).mockRejectedValue(new Error("Error creating budget"));

        fireEvent.change(screen.getByTestId("category-input")!, {
            target: { value: "Food" },
        });
        fireEvent.change(screen.getByTestId("amount-input")!, {
            target: { value: "4000" },
        });
        

        fireEvent.click(screen.getByRole("button", { name: /Create/i }));
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(`${API_URL}/budget/Usha`, {
                method: "POST",
                body: JSON.stringify({title:"Food", target:"4000"}),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            expect(window.alert).toHaveBeenCalledWith('Error creating budget');
        });
    })

   
});


describe("Checking Savings Form Component", () => {
    const mockSetUser = jest.fn();
    const renderComponent = (type:string,user:any) => {
        render(
            <UserContext.Provider
                value={{
                    user: user,
                    setUser: mockSetUser,
                    transactions: [],
                    setTransactions: jest.fn(),
                }}
            >
                <MemoryRouter>
                    <BudgetSavingForm type={type} />
                </MemoryRouter>
            </UserContext.Provider>
        );
    };

    beforeEach(() => {
        jest.resetAllMocks();
        window.alert = jest.fn();
    });

    it("Should create saving",async()=>{
        const user = {name:"Usha",password:"1234",totalIncome:20000,balance:10000}
        renderComponent("savings",user);
        (fetch as jest.Mock).mockResolvedValue({
            status:200,
            json: async () => ({ title:"Entertainment",target:"4000"} ),
        });

        fireEvent.change(screen.getByTestId("category-input")!, {
            target: { value: "Entertainment" },
        });
        fireEvent.change(screen.getByTestId("amount-input")!, {
            target: { value: "4000" },
        });
        

        fireEvent.click(screen.getByRole("button", { name: /Create/i }));
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(`${API_URL}/savings/Usha`, {
                method: "POST",
                body: JSON.stringify({title:"Entertainment", target:"4000"}),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            expect(window.alert).toHaveBeenCalledWith('SAVINGS created');
        });
    })

    it("Should not create saving due to incomplete form",async()=>{
        const user = {name:"Usha",password:"1234",totalIncome:20000,balance:10000}
        renderComponent("savings",user);
        (fetch as jest.Mock).mockResolvedValue({
            status:400,
            json: async () => ({ title:"Entertainment",target:""} ),
        });

        fireEvent.change(screen.getByTestId("category-input")!, {
            target: { value: "Entertainment" },
        });
        

        fireEvent.click(screen.getByRole("button", { name: /Create/i }));
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(`${API_URL}/savings/Usha`, {
                method: "POST",
                body: JSON.stringify({title:"Entertainment", target:""}),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            expect(window.alert).toHaveBeenCalledWith('Form Incomplete');
        });
    })

    it("Should create saving due to server error",async()=>{
        const user = {name:"Usha",password:"1234",totalIncome:20000,balance:10000}
        renderComponent("savings",user);
        (fetch as jest.Mock).mockResolvedValue({
            status:500,
            json: async () => ({ title:"Entertainment",target:"4000"} ),
        });

        fireEvent.change(screen.getByTestId("category-input")!, {
            target: { value: "Entertainment" },
        });
        fireEvent.change(screen.getByTestId("amount-input")!, {
            target: { value: "4000" },
        });
        

        fireEvent.click(screen.getByRole("button", { name: /Create/i }));
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(`${API_URL}/savings/Usha`, {
                method: "POST",
                body: JSON.stringify({title:"Entertainment", target:"4000"}),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            expect(window.alert).toHaveBeenCalledWith('Error creating savings');
        });
    })
   
});