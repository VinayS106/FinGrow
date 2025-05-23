import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TransactionForm from "../Forms/TransactionForm";
import { UserContext } from "../Context";
import { MemoryRouter } from "react-router-dom";
import { API_URL } from "../API";

global.fetch = jest.fn();

describe("TransactionForm Component", () => {
    const mockSetUser = jest.fn();
    const mockSetTransactions = jest.fn();
    const user = {
        name: "Usha",
        password: "1234",
        totalIncome: 20000,
        balance: 10000,
    };
    const renderComponent = (user?:any) => {
        render(
            <UserContext.Provider
                value={{
                    user: user?user:null,
                    setUser: mockSetUser,
                    transactions: [],
                    setTransactions: mockSetTransactions
                }}
            >
                <MemoryRouter>
                    <TransactionForm />
                </MemoryRouter>
            </UserContext.Provider>
        );
    };

    beforeEach(() => {
        jest.resetAllMocks();
        window.alert = jest.fn();
    });

    it("should render all input fields and the button", () => {
        renderComponent(user);

        expect(
            screen.getByPlaceholderText("Transaction Name")
        ).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Amount")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Variant")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Category")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Date")).toBeInTheDocument();
        expect(screen.getByText("Add")).toBeInTheDocument();
    });

    it("should update input values on change", () => {
        renderComponent(user);

        fireEvent.change(screen.getByPlaceholderText("Transaction Name"), {
            target: { value: "Groceries" },
        });
        fireEvent.change(screen.getByPlaceholderText("Amount"), {
            target: { value: "50" },
        });
        fireEvent.change(screen.getByPlaceholderText("Variant"), {
            target: { value: "Debit" },
        });
        fireEvent.change(screen.getByPlaceholderText("Category"), {
            target: { value: "Food" },
        });
        fireEvent.change(screen.getByPlaceholderText("Date"), {
            target: { value: "2024-10-16" },
        });

        expect(screen.getByPlaceholderText("Transaction Name")).toHaveValue(
            "Groceries"
        );
        expect(screen.getByPlaceholderText("Amount")).toHaveValue("50");
        expect(screen.getByPlaceholderText("Variant")).toHaveValue("Debit");
        expect(screen.getByPlaceholderText("Category")).toHaveValue("Food");
        expect(screen.getByPlaceholderText("Date")).toHaveValue("2024-10-16");
    });

    it("Should render no user when no user is present",()=>{
        renderComponent();
        expect(screen.getByText("NO user")).toBeInTheDocument();
    })

    it("should submit the transaction and show success alert", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
        });

        renderComponent(user);

        fireEvent.change(screen.getByPlaceholderText("Transaction Name"), {
            target: { value: "Groceries" },
        });
        fireEvent.change(screen.getByPlaceholderText("Amount"), {
            target: { value: "50" },
        });
        fireEvent.change(screen.getByPlaceholderText("Variant"), {
            target: { value: "Debit" },
        });
        fireEvent.change(screen.getByPlaceholderText("Category"), {
            target: { value: "Food" },
        });
        fireEvent.change(screen.getByPlaceholderText("Date"), {
            target: { value: "2024-10-16" },
        });

        fireEvent.click(screen.getByText("Add"));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                `${API_URL}/transaction/Usha`,
                expect.objectContaining({
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        transactionName: "Groceries",
                        category: "Food",
                        amount: "50",
                        on: "Debit",
                        date: "2024-10-16",
                    }),
                })
            );
            expect(window.alert).toHaveBeenCalledWith(`Transaction created`);
        });
    });

    it("should not submit the transaction when something goes wrong", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json:()=>"Network issue"
        });

        renderComponent(user);

        fireEvent.change(screen.getByPlaceholderText("Transaction Name"), {
            target: { value: "Groceries" },
        });
        fireEvent.change(screen.getByPlaceholderText("Amount"), {
            target: { value: "50" },
        });
        fireEvent.change(screen.getByPlaceholderText("Variant"), {
            target: { value: "Debit" },
        });
        fireEvent.change(screen.getByPlaceholderText("Category"), {
            target: { value: "Food" },
        });
        fireEvent.change(screen.getByPlaceholderText("Date"), {
            target: { value: "2024-10-16" },
        });

        fireEvent.click(screen.getByText("Add"));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                `${API_URL}/transaction/Usha`,
                expect.objectContaining({
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        transactionName: "Groceries",
                        category: "Food",
                        amount: "50",
                        on: "Debit",
                        date: "2024-10-16",
                    }),
                })
            );
            expect(window.alert).toHaveBeenCalledWith(`Something went wrong Network issue`);
        });
    });

    it("should submit the transaction, show success alert, and update transactions", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
        });
        
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => [
                { transactionName: "Groceries", amount: 50, category: "Food", date: "2024-10-16" },
            ],
        });

        renderComponent(user);

        fireEvent.change(screen.getByPlaceholderText("Transaction Name"), {
            target: { value: "Groceries" },
        });
        fireEvent.change(screen.getByPlaceholderText("Amount"), {
            target: { value: "50" },
        });
        fireEvent.change(screen.getByPlaceholderText("Variant"), {
            target: { value: "Debit" },
        });
        fireEvent.change(screen.getByPlaceholderText("Category"), {
            target: { value: "Food" },
        });
        fireEvent.change(screen.getByPlaceholderText("Date"), {
            target: { value: "2024-10-16" },
        });

        fireEvent.click(screen.getByText("Add"));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                `${API_URL}/transaction/Usha`,
                expect.objectContaining({
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        transactionName: "Groceries",
                        category: "Food",
                        amount: "50",
                        on: "Debit",
                        date: "2024-10-16",
                    }),
                })
            );
            expect(window.alert).toHaveBeenCalledWith(`Transaction created`);
            expect(fetch).toHaveBeenCalledWith(
                `${API_URL}/getTransactions/Usha`
            );
            expect(mockSetTransactions).toHaveBeenCalledWith([
                { transactionName: "Groceries", amount: 50, category: "Food", date: "2024-10-16" },
            ]);
        });
    });
    it("should handle failure to fetch updated transactions gracefully", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
        });

        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
        });

        renderComponent(user);

        fireEvent.change(screen.getByPlaceholderText("Transaction Name"), {
            target: { value: "Groceries" },
        });
        fireEvent.change(screen.getByPlaceholderText("Amount"), {
            target: { value: "50" },
        });
        fireEvent.change(screen.getByPlaceholderText("Variant"), {
            target: { value: "Debit" },
        });
        fireEvent.change(screen.getByPlaceholderText("Category"), {
            target: { value: "Food" },
        });
        fireEvent.change(screen.getByPlaceholderText("Date"), {
            target: { value: "2024-10-16" },
        });

        fireEvent.click(screen.getByText("Add"));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                `${API_URL}/transaction/Usha`,
                expect.objectContaining({
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        transactionName: "Groceries",
                        category: "Food",
                        amount: "50",
                        on: "Debit",
                        date: "2024-10-16",
                    }),
                })
            );
            expect(window.alert).toHaveBeenCalledWith(`Transaction created`);
            expect(fetch).toHaveBeenCalledWith(
                `${API_URL}/getTransactions/Usha`
            );
            expect(mockSetTransactions).not.toHaveBeenCalled(); 
        });
    });
    it("should throw error", async () => {
        (fetch as jest.Mock).mockRejectedValue(new Error("Error While creating "));

        renderComponent(user);

        fireEvent.change(screen.getByPlaceholderText("Transaction Name"), {
            target: { value: "Groceries" },
        });
        fireEvent.change(screen.getByPlaceholderText("Amount"), {
            target: { value: "50" },
        });
        fireEvent.change(screen.getByPlaceholderText("Variant"), {
            target: { value: "Debit" },
        });
        fireEvent.change(screen.getByPlaceholderText("Category"), {
            target: { value: "Food" },
        });
        fireEvent.change(screen.getByPlaceholderText("Date"), {
            target: { value: "2024-10-16" },
        });

        fireEvent.click(screen.getByText("Add"));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                `${API_URL}/transaction/Usha`,
                expect.objectContaining({
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        transactionName: "Groceries",
                        category: "Food",
                        amount: "50",
                        on: "Debit",
                        date: "2024-10-16",
                    }),
                })
            );
            expect(window.alert).toHaveBeenCalledWith(`Error while creating transaction`);
        });
    });
});
