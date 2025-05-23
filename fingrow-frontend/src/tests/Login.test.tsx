import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, BrowserRouter as Router } from "react-router-dom";
import Login from "../Views/Login/Login";
import { UserContext } from "../Context";
import { API_URL } from "../API";


const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

global.fetch = jest.fn();


describe("Check login interface", () => {
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
                    <Login />
                </MemoryRouter>
            </UserContext.Provider>
        );
    };

    beforeEach(() => {
        jest.resetAllMocks();
        window.alert = jest.fn();
        renderComponent();
    });

    it("Shoould render no context present when no context",()=>{
        render(<Login/>)
        expect(screen.getByText("Context not present")).toBeInTheDocument()
    })

    it("Should render Login component correctly", () => {

        expect(
            screen.getByText("Welcome to FinGrow Finance Application")
        ).toBeInTheDocument();
        expect(screen.getByText("Login")).toBeInTheDocument();
        expect(screen.getByLabelText("User Name:")).toBeInTheDocument();
        expect(screen.getByLabelText("Password:")).toBeInTheDocument();
    });

    it("Should check for clicking the input fields", () => {
        fireEvent.change(screen.getByLabelText("User Name:"), {
            target: { value: "Usha" },
        });
        fireEvent.change(screen.getByLabelText("Password:"), {
            target: { value: "1234" },
        });

        expect(screen.getByLabelText("User Name:")).toHaveValue("Usha");
        expect(screen.getByLabelText("Password:")).toHaveValue("1234");
    });

    it("Should navigate to register page when 'Not having account is clicked", () => {
        const registerLink = screen.getByTestId("non-account-holder");
        fireEvent.click(registerLink);  
        expect(mockNavigate).toHaveBeenCalledWith("/register");  
    });

    it("Should navigate to dashboard after succesfull login",async()=>{
        (fetch as jest.Mock).mockResolvedValueOnce({
            status: 200,
            json: async () => ({name:"Usha",password:"1234",totalIncome:20000,balance:10000}),
        });

        fireEvent.change(screen.getByLabelText("User Name:"), {
            target: { value: "Usha" },
        });
        fireEvent.change(screen.getByLabelText("Password:"), {
            target: { value: "1234" },
        });

        fireEvent.click(screen.getByRole("button", { name: /Submit/i }));
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(`${API_URL}/users/Usha`, {
                method: "POST",
                body: JSON.stringify({ password: "1234" }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            expect(mockSetUser).toHaveBeenCalledWith({name:"Usha",password:"1234",totalIncome:20000,balance:10000});
            expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
        });
    })

    it("Should not get logged in as wrong user name",async()=>{
        (fetch as jest.Mock).mockResolvedValueOnce({
            status: 404,
            json: async () => null,
        });

        fireEvent.change(screen.getByLabelText("User Name:"), {
            target: { value: "Achyu" },
        });
        fireEvent.change(screen.getByLabelText("Password:"), {
            target: { value: "1234" },
        });

        fireEvent.click(screen.getByRole("button", { name: /Submit/i }));
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(`${API_URL}/users/Achyu`, {
                method: "POST",
                body: JSON.stringify({ password: "1234" }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            expect(window.alert).toHaveBeenCalledWith(
                "User with given user name is not present"
            );

        });
    })

    it("Should not get logged in with invalid credentials", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            status: 401,
            json: async () => null,
        });
        fireEvent.change(screen.getByLabelText("User Name:"), {
            target: { value: "Usha" },
        });
        fireEvent.change(screen.getByLabelText("Password:"), {
            target: { value: "12345" },
        });
  
        fireEvent.click(screen.getByRole("button", { name: /Submit/i }));
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(`${API_URL}/users/Usha`, {
                method: "POST",
                body: JSON.stringify({ password: "12345" }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            expect(window.alert).toHaveBeenCalledWith("Invalid Credentials: UnAuthorised.");
        });
    });
    
    it("Should not get logged in as network issue",async()=>{
        (fetch as jest.Mock).mockResolvedValueOnce({
            status: 500,
            json: async () => null,
        });

        fireEvent.change(screen.getByLabelText("User Name:"), {
            target: { value: "Usha" },
        });
        fireEvent.change(screen.getByLabelText("Password:"), {
            target: { value: "1234" },
        });

        fireEvent.click(screen.getByRole("button", { name: /Submit/i }));
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(`${API_URL}/users/Usha`, {
                method: "POST",
                body: JSON.stringify({ password: "1234" }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            expect(window.alert).toHaveBeenCalledWith(
                "Error logging in: null"
            );

        });
    })

    it("Should not get logged in as network issue",async()=>{
        (fetch as jest.Mock).mockRejectedValue(new Error("Error occured while fetching user details"));

        fireEvent.change(screen.getByLabelText("User Name:"), {
            target: { value: "Usha" },
        });
        fireEvent.change(screen.getByLabelText("Password:"), {
            target: { value: "1234" },
        });

        fireEvent.click(screen.getByRole("button", { name: /Submit/i }));
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(`${API_URL}/users/Usha`, {
                method: "POST",
                body: JSON.stringify({ password: "1234" }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            expect(window.alert).toHaveBeenCalledWith(
                "Error occured while fetching user details"
            );
        });
    })
});


