import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, BrowserRouter as Router } from "react-router-dom";
import { UserContext } from "../Context";
import Register from "../Views/Register/Register";
import { API_URL } from "../API";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

global.fetch = jest.fn();

describe("Checking register page", () => {
    const mockSetUser = jest.fn();
    const renderComponent = () => {
        render(
            <UserContext.Provider
                value={{
                    user: null,
                    setUser: mockSetUser,
                    transactions: [],
                    setTransactions: jest.fn(),
                }}
            >
                <MemoryRouter>
                    <Register />
                </MemoryRouter>
            </UserContext.Provider>
        );
    };
    beforeEach(() => {
        jest.resetAllMocks();
        window.alert = jest.fn();
        renderComponent();
    });

    it('Should test whether register page should render properly',()=>{
        expect(screen.getByText("Welcome to FinGrow Finance Application")).toBeInTheDocument();
        expect(screen.getByText("Register")).toBeInTheDocument();
        expect(screen.getByLabelText("User Name:")).toBeInTheDocument();
        expect(screen.getByLabelText("Password:")).toBeInTheDocument();
        expect(screen.getByLabelText("Total Income:")).toBeInTheDocument();
    })

    it("Should check for clicking the input fields", () => {
        fireEvent.change(screen.getByLabelText("User Name:"), {
            target: { value: "Usha" },
        });
        fireEvent.change(screen.getByLabelText("Password:"), {
            target: { value: "1234" },
        });
        fireEvent.change(screen.getByLabelText("Total Income:"), {
            target: { value: 20000 },
        });
        expect(screen.getByLabelText("User Name:")).toHaveValue("Usha");
        expect(screen.getByLabelText("Password:")).toHaveValue("1234");
        expect(screen.getByLabelText("Total Income:")).toHaveValue(20000);
    });

    it("Should redirect to login after successfull registration",async()=>{
        (fetch as jest.Mock).mockResolvedValue({
            ok:true,
            json: async () => ({ username: "Usha",password:"1234",totalIncome:20000, balance:20000} ),
        });

        fireEvent.change(screen.getByLabelText("User Name:"), {
            target: { value: "Usha" },
        });
        fireEvent.change(screen.getByLabelText("Password:"), {
            target: { value: "1234" },
        });
        fireEvent.change(screen.getByLabelText("Total Income:"), {
            target: { value: 20000 },
        });

        fireEvent.click(screen.getByRole("button", { name: /Submit/i }));
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(`${API_URL}/users`, {
                method: "POST",
                body: JSON.stringify({ name: "Usha",password:"1234",totalIncome:20000, balance:20000}),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            expect(window.alert).toHaveBeenCalledWith('User created succesfully');
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });
    })
    it("Should navigate to login when 'Already have an account' is clicked", () => {
        const loginLink = screen.getByTestId("account-holder");
        fireEvent.click(loginLink);  
        expect(mockNavigate).toHaveBeenCalledWith("/");  
    });
    
    it("Should not create user in case of server issue",async()=>{
        (fetch as jest.Mock).mockResolvedValue({
            ok:false,
            json: async () => ({ name: "Hari",password:"1234",totalIncome:20000, balance:20000} ),
        });

        fireEvent.change(screen.getByLabelText("User Name:"), {
            target: { value: "Hari" },
        });
        fireEvent.change(screen.getByLabelText("Password:"), {
            target: { value: "1234" },
        });
        fireEvent.change(screen.getByLabelText("Total Income:"), {
            target: { value: 20000 },
        });

        fireEvent.click(screen.getByRole("button", { name: /Submit/i }));
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(`${API_URL}/users`, {
                method: "POST",
                body: JSON.stringify({ name: "Hari",password:"1234",totalIncome:20000, balance:20000}),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            expect(window.alert).toHaveBeenCalledWith('Error creating user');
        });
    })

    it("Should handle fetch errors gracefully", async () => {
        (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));
        fireEvent.change(screen.getByLabelText("User Name:"), {
            target: { value: "user2" },
        });
        fireEvent.change(screen.getByLabelText("Password:"), {
            target: { value: "12345" },
        });
        fireEvent.change(screen.getByLabelText("Total Income:"), {
            target: { value: 50000 },
       });
        fireEvent.click(screen.getByRole("button", { name: /Submit/i }));
        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("Error creating User");
        });
    });
    
});
