import {
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import FiveTransactions from "../Components/FiveTransactions/FiveTransactions";
import { UserContext } from "../Context";
import { MemoryRouter } from "react-router-dom";
import { API_URL } from "../API";

const mockTransactions = [
    {
        transactionName: "Salary",
        title: "Monthly salary payment",
        type: "credit",
        on:"budget",
        amount: 1000,
        userId:"1",
        date: new Date("2023-01-05T00:00:00.000Z"),
    },
    {
        transactionName: "Grocery",
        title: "Weekly grocery shopping",
        type: "debit",
        on:"budget",
        amount: 200,
        userId:"1",
        date: new Date( "2023-01-06T00:00:00.000Z"),
    },
];

const user = {
    name: "Usha",
    password: "1234",
    totalIncome: 20000,
    balance: 10000,
};


describe("FiveTransactions Component", () => {
    const mockSetUser = jest.fn();
    const setTransactionsMock=jest.fn();
    const renderComponent = (transactions:any) => {
        render(
            <UserContext.Provider
                value={{
                    user: user,
                    setUser: mockSetUser,
                    transactions: transactions,
                    setTransactions: setTransactionsMock,
                }}
            >
                <MemoryRouter>
                    <FiveTransactions />
                </MemoryRouter>
            </UserContext.Provider>
        );
    };

    beforeEach(() => {
        jest.resetAllMocks();
        window.alert = jest.fn();
         global.fetch = jest.fn();
        
    });
    
    it("should render Tile components for each transaction", async () => {
        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockTransactions,
        });

        renderComponent(mockTransactions);
        await waitFor(() => {
            expect(setTransactionsMock).toHaveBeenCalledWith(mockTransactions); 
        });
    });

    it('should render "No recent Transactions Found" when transactions state is an empty array', async () => {
        renderComponent([]);
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                `${API_URL}/getTransactions/Usha`
            );
            expect(setTransactionsMock).not.toHaveBeenCalled(); 
        });
    });

    it("Should hit the respective url to get the transactions", async () => {
        renderComponent(mockTransactions);
        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockTransactions,
        });

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                `${API_URL}/getTransactions/${user.name}`
            );
        });
    });

    it("should not display a list of transactions when data is not fetched", async () => {
        renderComponent([]);
        (fetch as jest.Mock).mockResolvedValue({
            ok:true,
            json: async () => [],
        });
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                `${API_URL}/getTransactions/${user.name}`
            );
            expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Error fetching Transactions"));
        });
    });

    it("should show an alert when the fetch call fails)", async () => {
        (fetch as jest.Mock).mockResolvedValue({
            ok:false,
            json: async () => [],
        });

        renderComponent([]);
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(`${API_URL}/getTransactions/${user.name}`);
            expect(window.alert).toHaveBeenCalledWith("Error fetching Transactions");
        });
    });
});
