import { render, screen } from "@testing-library/react";
import Expenses from "../Components/Expenses/Expenses";
import Transactions from "../Components/Transactions/Transactions";
import Budget from "../Components/Budget/Budget";
import Savings from "../Components/Savings/Savings";
import FiveTransactions from "../Components/FiveTransactions/FiveTransactions";
import FinancialReport from "../Components/Report/FinancialReport";

describe("Expenses Component", () => {
    it("should render the header with 'Record Expenses'", () => {
        render(<Expenses />);
        expect(screen.getByText("Record Expenses")).toBeInTheDocument();
    });
    it("should render Transactions component'", () => {
        render(<Expenses />);
        expect(screen.getByText("Add Transaction")).toBeInTheDocument();
    });
    it("should render budget component'", () => {
        render(<Expenses />);
        expect(screen.getByText("Create Budget")).toBeInTheDocument();
    });
    it("should render saving component'", () => {
        render(<Expenses />);
        expect(screen.getByText("Create Saving Goal")).toBeInTheDocument();
    });
    
});