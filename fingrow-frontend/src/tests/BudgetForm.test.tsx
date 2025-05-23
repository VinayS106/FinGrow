import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import BudgetSavingForm from "../Forms/BudgetSavingForm";
import { UserContext } from "../Context";
import { MemoryRouter } from "react-router-dom";

global.fetch = jest.fn();

describe("BudgetSavingForm Component", () => {
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
    });

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


   
});
