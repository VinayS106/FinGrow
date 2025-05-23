import TopSection from "../Components/TopSection/TopSection";
import { render, screen } from "@testing-library/react";
import { UserContext } from "../Context";
import { MemoryRouter } from "react-router-dom";

describe("TopSection Component", () => {
    const mockSetUser = jest.fn();
    const user = {
        name: "Usha",
        password: "1234",
        totalIncome: 20000,
        balance: 20000,
    };
    const renderComponent = (user?: any) => {
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
                    <TopSection />
                </MemoryRouter>
            </UserContext.Provider>
        );
    };

    beforeEach(() => {
        jest.resetAllMocks();
        window.alert = jest.fn();
    });

    it('should display "User not found" when user is not available in the context', () => {
        renderComponent();
        expect(screen.queryByText("User not found")).toBeInTheDocument();
    });

    it('should display "context not present" when context is not present', () => {
        render(<TopSection/>)
        expect(screen.queryByText("Context not present")).toBeInTheDocument();
    });

    it("should display the user's name when user is present in the context", () => {
        renderComponent(user);
        expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
        expect(screen.getByText(/Usha/i)).toBeInTheDocument();
    });

    it("should display the finance management message when user is present", () => {
        renderComponent(user);
        expect(screen.getByText(/Your One Stop/i)).toBeInTheDocument();
        expect(screen.getByText(/Finance/i)).toBeInTheDocument();
        expect(screen.getByText(/Management System/i)).toBeInTheDocument();
    });

    it("should render the image with the correct src", () => {
        renderComponent(user);
        const image = screen.getByRole("img");
        expect(image).toHaveAttribute("src", "./assets/img1.png");
    });
});
