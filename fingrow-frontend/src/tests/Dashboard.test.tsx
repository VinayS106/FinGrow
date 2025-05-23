import Dashboard from "../Views/Dashboard/Dashboard";
import { render, screen} from "@testing-library/react";
describe("Checking dashboard component",()=>{
    it("Should render diashboard component properly",()=>{
        render(<Dashboard/>)
        expect(screen.getByText("Fin")).toBeInTheDocument();
        expect(screen.getByText("Grow")).toBeInTheDocument();
    })
})