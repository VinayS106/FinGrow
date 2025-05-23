import { render, screen } from '@testing-library/react';
import TagIcon from '../Components/TagIcon/TagIcon';

describe("TagIcon Component", () => {

    const renderComponent = (type: string) => {
        render(<TagIcon type={type} />);
    };

    it("should display 'Add Transaction' and the GrTable icon for type 'transaction'", () => {
        renderComponent("transaction");
        expect(screen.getByText(/Add Transaction/i)).toBeInTheDocument();
        expect(screen.getByTestId('transaction-icon')).toBeInTheDocument();
    });

    it("should display 'Create Budget' and the BsFillPersonCheckFill icon for type 'budget'", () => {
        renderComponent("budget");
        expect(screen.getByText(/Create Budget/i)).toBeInTheDocument();
        expect(screen.queryByTestId('transaction-icon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('budget-icon')).toBeInTheDocument();
    });

    it("should display 'Create Saving Goal' and the FaHandHoldingMedical icon for type 'saving'", () => {
        renderComponent("saving");
        expect(screen.getByText(/Create Saving Goal/i)).toBeInTheDocument();
        expect(screen.queryByTestId('saving-icon')).toBeInTheDocument();
    });

    it("should display 'Recent 5 transactions' and the MdMoney icon for type 'recent'", () => {
        renderComponent("recent");
        expect(screen.getByText(/Recent 5 transactions/i)).toBeInTheDocument();
        expect(screen.queryByTestId('5')).toBeInTheDocument();
    });

    it("should display 'Generate Reports' and the TbReport icon for any other type", () => {
        renderComponent("other");
        expect(screen.getByText(/Generate Reports/i)).toBeInTheDocument();
        expect(screen.queryByTestId('reports')).toBeInTheDocument();
    });
});
