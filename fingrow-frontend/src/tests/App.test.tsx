import { render, screen } from "@testing-library/react";
import App from "../App";

jest.mock("../Views/Login/Login", () => () => <div>Login Page</div>);
jest.mock("../Views/Register/Register", () => () => <div>Register Page</div>);
jest.mock("../Views/Dashboard/Dashboard", () => () => <div>Dashboard Page</div>);

describe("App component", () => {
    test("renders the Login component at the root path", () => {
        render(<App />);
        expect(screen.getByText("Login Page")).toBeInTheDocument();
    });

    test("renders the Register component at /register path", () => {
        window.history.pushState({}, "Register page", "/register");
        render(<App />);
        expect(screen.getByText("Register Page")).toBeInTheDocument();
    });

    test("renders the Dashboard component at /dashboard path", () => {
        window.history.pushState({}, "Dashboard page", "/dashboard");
        render(<App />);
        expect(screen.getByText("Dashboard Page")).toBeInTheDocument();
    });

});
