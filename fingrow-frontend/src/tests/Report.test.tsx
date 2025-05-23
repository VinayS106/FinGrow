import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FinancialReport from "../Components/Report/FinancialReport";
import { UserContext } from "../Context";
import { API_URL } from "../API";
import { MemoryRouter } from "react-router-dom";

global.fetch = jest.fn();

describe("FinancialReport Component", () => {
    const mockSetUser = jest.fn();
    const renderComponent = (user:any) => {
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
                    <FinancialReport />
                </MemoryRouter>
            </UserContext.Provider>
        );
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });
    test("renders 'No User Context' when no user is present", () => {
        renderComponent(null);
        expect(screen.getByText("No User Context")).toBeInTheDocument();
    });

    test("renders report type dropdown and form fields", () => {
        renderComponent(mockSetUser);
        expect(screen.getByText("Select a report")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Generate Report" })).toBeInTheDocument();
    });

    test("alerts when no report type is selected and 'Generate Report' is clicked", () => {
        renderComponent(mockSetUser)
        window.alert = jest.fn();
        fireEvent.click(screen.getByRole("button", { name: "Generate Report" }));
        expect(window.alert).toHaveBeenCalledWith("Please fill in all fields.");
    });

    test("fetches Income/Expenses report and displays results", async () => {
        renderComponent(mockSetUser);
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                totalIncome: 1000,
                totalExpenses: 500,
                income: [{ trasactionName:"milk",title: "Dairy" }],
                expenses: [{ title: "Groceries" }],
            }),
        });

        fireEvent.change(screen.getByLabelText("Report Type"), {
            target: { value: "Income/Expenses" },
        });
        fireEvent.change(screen.getByTestId("startDate"), {
            target: { value: "2024-10-01" },
        });
        fireEvent.change(screen.getByTestId("endDate"), {
            target: { value: "2024-10-21" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Generate Report" }));
        await waitFor(() => {
            expect(screen.getByText("Total Income in provided duration: 1000")).toBeInTheDocument();
            expect(screen.getByText("Total Expenses in provided duration: 500")).toBeInTheDocument();
            expect(screen.getByText("Credit transactions")).toBeInTheDocument();
            expect(screen.getByText("Debit transactions")).toBeInTheDocument();
        });
    });

    test("fetches Budget Summary report and displays results", async () => {
        renderComponent(mockSetUser);
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => [
                { category: "Food", spent: 200, usagePercentage: "80%" },
                { category: "Transport", spent: 50, usagePercentage: "50%" },
            ],
        });

        fireEvent.change(screen.getByLabelText("Report Type"), {
            target: { value: "Budget Summary" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Generate Report" }));
        
        await waitFor(() => {
            expect(screen.getByText("Food")).toBeInTheDocument();
            expect(screen.getByText("80%")).toBeInTheDocument();
            expect(screen.getByText("Transport")).toBeInTheDocument();
            expect(screen.getByText("50%")).toBeInTheDocument();
        });
    });

    test("fetches Savings Progress report and displays results", async () => {
        renderComponent(mockSetUser);
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => [
                { savingGoal: "Vacation", current: 900, progressPercentage: "90%" },
                { savingGoal: "New Car", current: 3000, progressPercentage: "30%" },
            ],
        });

        fireEvent.change(screen.getByLabelText("Report Type"), {
            target: { value: "Savings Progress" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Generate Report" }));
        
        await waitFor(() => {
            expect(screen.getByText("Vacation")).toBeInTheDocument();
            expect(screen.getByText("90%")).toBeInTheDocument();
            expect(screen.getByText("New Car")).toBeInTheDocument();
            expect(screen.getByText("30%")).toBeInTheDocument();
        });
    });

    test("handles case when report data is a string", async () => {
        renderComponent(mockSetUser);
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: () => "No corresponding report found",
        });

        fireEvent.change(screen.getByLabelText("Report Type"), {
            target: { value: "Income/Expenses" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Generate Report" }));

        await waitFor(() => {
            expect(screen.getByText("No corresponding report found")).toBeInTheDocument();
        });
    });

    test("alerts when budget categories exceed 90% target", async () => {
        renderComponent(mockSetUser);
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: () => [
                { category: "Entertainment", spent: 95, usagePercentage: "95%" },
            ],
        });

        window.alert = jest.fn();
        
        fireEvent.change(screen.getByLabelText("Report Type"), {
            target: { value: "Budget Summary" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Generate Report" }));
        
        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("The categories: Entertainment  have exceeded 90% of target amount");
        });
    });
    test("alerts when savings progress exceeds 90%", async () => {
        renderComponent(mockSetUser);
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => [
                { savingGoal: "Emergency Fund", current: 950, progressPercentage: "95%" },
            ],
        });

        window.alert = jest.fn();
        
        fireEvent.change(screen.getByLabelText("Report Type"), {
            target: { value: "Savings Progress" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Generate Report" }));
        
        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("The savings: Emergency Fund  have exceeded 90% of target amount Congratulations");
        });
    });
    test("alerts when there is an error fetching the report", async () => {
        renderComponent(mockSetUser);
        (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));
    
        window.alert = jest.fn();
    
        fireEvent.change(screen.getByLabelText("Report Type"), {
            target: { value: "Budget Summary" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Generate Report" }));
        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("Error fetching report");
        });
    });
    test("should alert spmething went wrong", async () => {
        renderComponent(mockSetUser);
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: async () => [],
        });

        window.alert = jest.fn();
        
        fireEvent.change(screen.getByLabelText("Report Type"), {
            target: { value: "Savings Progress" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Generate Report" }));
        
        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("Something went wrong");
        });
    });
    
})
