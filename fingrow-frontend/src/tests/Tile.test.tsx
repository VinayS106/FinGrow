import { render, screen } from "@testing-library/react";
import Tile from "../Components/FiveTransactions/Tile";
import styles from "./Transaction.module.css"; // Import styles for testing

describe("Tile Component", () => {
    const transactionMock = {
        type: "credit",
        transactionName: "Salary",
        title: "Monthly Salary",
        date: "2024-10-01T00:00:00Z",
        amount: 5000,
    };

    it("should render the transaction details correctly for credit type", () => {
        render(<Tile transaction={transactionMock} />);
        expect(screen.getByText("Salary -Monthly Salary")).toBeInTheDocument();
        expect(screen.getByText("1 Oct 2024")).toBeInTheDocument();
        expect(screen.getByText("+Rs.5000")).toBeInTheDocument();
    });

    it("should render the transaction details correctly for debit type", () => {
        const debitTransactionMock = { ...transactionMock, type: "debit", amount: 2000 };
        render(<Tile transaction={debitTransactionMock} />);
        expect(screen.getByText("Salary -Monthly Salary")).toBeInTheDocument();
        expect(screen.getByText("1 Oct 2024")).toBeInTheDocument();
        expect(screen.getByText("-Rs.2000")).toBeInTheDocument();
    });

});
